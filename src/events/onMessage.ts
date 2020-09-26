/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Bot from "@Bot";
import { Message } from "discord.js";
import IMessage from "@Interfaces/IMessage";
import ISetting from "@Interfaces/ISetting";

/**
 * Reply an user message and delete the bot message in five seconds.
 *
 * @async
 * @function
 * @param { IMessage } this
 * @param { string } message
 * @returns { Promise<void> }
 */
async function deleteMessageInFiveSeconds(
  this: IMessage,
  message: string
): Promise<void> {
  // Send a reply to the user with a message.
  const botMessage = await this.reply(message);

  // Sleep by 5 seconds.
  await this.bot.sleep(5000);

  // Check if the message can be deleted.
  if (botMessage.deletable) {
    // Delete the message.
    await botMessage.delete();
  }
}

/**
 * Get the developer role from the database.
 *
 * @async
 * @function
 * @param { IMessage } this
 * @returns { Promise<ISetting | null> }
 */
async function getDevRole(this: IMessage): Promise<ISetting | null> {
  return await this.bot.getDatabase().getSettingByKey("dev_role");
}

/**
 * On channel message event.
 *
 * @async
 * @function
 * @param { Bot } bot
 * @param { Message } message
 * @returns { Promise<void> }
 */
async function onMessage(bot: Bot, message: Message): Promise<void> {
  // Check if the message content does not starts with the prefix.
  if (!message.content.startsWith(bot.getPrefix())) {
    return;
  }

  // Split the message content by spaces.
  const commandArguments = message.content.split(" ");

  // Get the first argument.
  const commandName = commandArguments.shift();

  if (commandName) {
    // Get the command by its name.
    const command = bot
      .getCommands()
      .getCommandByName(commandName.slice(bot.getPrefix().length));

    if (command) {
      // Set a new IMessage object.
      const iMessage: IMessage = Object.assign(message, {
        color: "#5dc0b9",
        bot,
        // Get the no emoji from the server emojis.
        noEmoji:
          bot.getClient().emojis.cache.find((e) => e.name === "no1") || null,
        // Get the yes emoji from the server emojis.
        yesEmoji:
          bot.getClient().emojis.cache.find((e) => e.name === "yes1") || null,
        getDevRole,
        sendAndDestroyInFiveSeconds: deleteMessageInFiveSeconds,
      });

      // Execute the command.
      await command.run(iMessage, commandArguments);
    }
  }
}

export default onMessage;
