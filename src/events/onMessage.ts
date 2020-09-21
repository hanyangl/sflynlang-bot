/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Bot from '@Bot';
import { Message } from "discord.js";
import IMessage from '@Interfaces/IMessage';
import ISetting from '@Interfaces/ISetting';

async function deleteMessageInFiveSeconds(this: IMessage, message: string): Promise<void> {
  const botMessage = await this.reply(message);

  // Sleep by 5 seconds.
  await this.bot.sleep(5000);

  // Check if the message can be deleted.
  if (botMessage.deletable) {
    // Delete the message.
    await botMessage.delete();
  }
}

async function getDevRole(this: IMessage): Promise<ISetting | null> {
  return await this.bot.getDatabase().getSettingByKey('dev_role');
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
  const commandArguments = message.content.split(' ');

  // Get the first argument.
  const commandName = commandArguments.shift();

  if (commandName) {
    // Get the command by its name.
    const command = bot.getCommands().getCommandByName(commandName.slice(bot.getPrefix().length));

    if (command) {
      const iMessage: IMessage = Object.assign(
        message,
        {
          bot,
          getDevRole,
          sendAndDestroyInFiveSeconds: deleteMessageInFiveSeconds,
        },
      );

      // Execute the command.
      await command.run(iMessage, commandArguments);
    }
  }
}

export default onMessage;
