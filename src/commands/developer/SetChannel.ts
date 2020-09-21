/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { developer } from '@Decorators/commandTypes';
import command from '@Decorators/command';
import Command from '@Commands/Command';
import IMessage from '@Interfaces/IMessage';

@developer
@command({
  name: 'setchannel',
  arguments: '<channel_type> <channel_mention>',
  description: 'Set a channel to the settings.',
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

    const channelType = args.shift();

    if (!channelType) {
      await message.sendAndDestroyInFiveSeconds('you must specify the channel type.');
      return;
    }

    const devRole = await message.getDevRole();

    if (!['suggestions', 'welcomes'].includes(channelType)) {
      await message.sendAndDestroyInFiveSeconds(`the channel type ('${channelType}') is not valid.`);
      return;
    }

    if (!devRole) {
      await message.sendAndDestroyInFiveSeconds('the developer role is not configured.');
      return;
    }

    if (!message.member.roles.cache.has(devRole.value)) {
      await message.sendAndDestroyInFiveSeconds('you need be a server bot developer.');
      return;
    }

    const channelMention = args.shift();

    if (!channelMention) {
      await message.sendAndDestroyInFiveSeconds(`you must mention the new ${channelMention} channel.`);
      return;
    }

    // Get the first channel mention.
    const firstChannel = message.mentions.channels.first();

    if (!firstChannel || firstChannel.toString() !== channelMention) {
      await message.sendAndDestroyInFiveSeconds('the channel is not valid.');
      return;
    }

    const key = `${channelType.toLowerCase()}_channel`;
    const editChannel = await message.bot.getDatabase().getSettingByKey(key);

    if (editChannel) {
      editChannel.value = firstChannel.id;
      await editChannel.save();
    } else {
      await message.bot.getDatabase().getSettings().create({
        key,
        value: firstChannel.id,
      });
    }

    // Send the success message to the current channel.
    await message.sendAndDestroyInFiveSeconds(`now ${firstChannel.toString()} is the ${channelType} channel.`);
  }
}

export default SetChannel;
