/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { general } from "@Decorators/commandTypes";
import command from "@Decorators/command";
import Command from "@Commands/Command";
import IMessage from "@Interfaces/IMessage";
import { GuildChannel, MessageEmbed, TextChannel } from "discord.js";

@general
@command({
  name: "suggestion",
  arguments: "<message>",
  description: "Send a new suggestion.",
})
class Suggestion extends Command {
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

    // Get the suggestions channel id from the database.
    const suggestionsChannelS = await message.bot
      .getDatabase()
      .getSettingByKey("suggestions_channel");
    if (!suggestionsChannelS) {
      await message.sendAndDestroyInFiveSeconds(
        "the suggestions channel is not configured."
      );
      return;
    }

    // Get the suggestions channel.
    const suggestionsChannel = message.guild.channels.cache.get(
      suggestionsChannelS.value
    );
    if (!suggestionsChannel) {
      await message.sendAndDestroyInFiveSeconds(
        "the suggestions channel does not exist."
      );
      return;
    }

    // Check if the suggestions channel is a text channel.
    if (
      !((o: GuildChannel): o is TextChannel => o.type === "text")(
        suggestionsChannel
      )
    ) {
      await message.sendAndDestroyInFiveSeconds(
        "the suggestions channel is not a valid text channel."
      );
      return;
    }

    // Get the suggestion message from the arguments.
    const suggestionMessage = args.join(" ");
    if (!suggestionMessage || !suggestionMessage.length) {
      await message.sendAndDestroyInFiveSeconds(
        "you must enter the suggestion message."
      );
      return;
    }

    // Send the suggestion to the suggestions channel.
    const botMessage = await suggestionsChannel.send(
      new MessageEmbed()
        .setAuthor("New suggestion", message.author.displayAvatarURL())
        .setColor(message.color)
        .setDescription(
          `${suggestionMessage}\r\n\r\nBy: ${message.author.toString()}`
        )
        .setTimestamp(Date.now())
    );

    // Add 'no' reaction to the bot message.
    await botMessage.react(message.noEmoji || "❌");

    // Add 'yes' reaction to the bot message.
    await botMessage.react(message.yesEmoji || "✅");
  }
}

export default Suggestion;
