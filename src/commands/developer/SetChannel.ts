/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { developer } from "@Decorators/commandTypes";
import command from "@Decorators/command";
import Command from "@Commands/Command";
import IMessage from "@Interfaces/IMessage";

@developer
@command({
  name: "setchannel",
  arguments: "<channel_type> <channel_mention>",
  description: "Set a channel to the settings.",
})
class SetChannel extends Command {
  async run(message: IMessage, args: string[]): Promise<void> {
    // Ignore private messages.
    if (!message.guild || !message.member) {
      return;
    }

    // Check if the message can be deleted.
    if (message.deletable) {
      // Delete the message.
      await message.delete();
    }

    // Get the next argument as the channel type.
    const channelType = args.shift();

    // Check if the argument exists.
    if (!channelType) {
      await message.sendAndDestroyInFiveSeconds(
        "you must specify the channel type."
      );
      return;
    }

    // Get the developer role id from the database.
    const devRole = await message.getDevRole();

    if (!["suggestions", "welcomes", "rules", "github"].includes(channelType)) {
      await message.sendAndDestroyInFiveSeconds(
        `the channel type ('${channelType}') is not valid.`
      );
      return;
    }

    // Check if the developer role exists.
    if (!devRole) {
      await message.sendAndDestroyInFiveSeconds(
        "the developer role is not configured."
      );
      return;
    }

    // Check if the command actioner has the developer role.
    if (!message.member.roles.cache.has(devRole.value)) {
      await message.sendAndDestroyInFiveSeconds(
        "you need be a server bot developer."
      );
      return;
    }

    // Get the next argument as the channel mention.
    const channelMention = args.shift();

    // Check if the argument exists.
    if (!channelMention) {
      await message.sendAndDestroyInFiveSeconds(
        `you must mention the new ${channelMention} channel.`
      );
      return;
    }

    // Get the first channel mention.
    const firstChannel = message.mentions.channels.first();

    // Check if the argument and the first channel mention are equals.
    if (!firstChannel || firstChannel.toString() !== channelMention) {
      await message.sendAndDestroyInFiveSeconds("the channel is not valid.");
      return;
    }

    // Get the channel key.
    const key = `${channelType.toLowerCase()}_channel`;

    // Get the channel type from the database.
    const editChannel = await message.bot.getDatabase().getSettingByKey(key);

    // Check if the channel exists in the database and updates it.
    if (editChannel) {
      editChannel.value = firstChannel.id;
      await editChannel.save();
    }
    // Otherwise, create a new channel setting.
    else {
      await message.bot.getDatabase().getSettings().create({
        key,
        value: firstChannel.id,
      });
    }

    // Send the success message to the current channel.
    await message.sendAndDestroyInFiveSeconds(
      `now ${firstChannel.toString()} is the ${channelType} channel.`
    );
  }
}

export default SetChannel;
