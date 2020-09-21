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
      // Execute the command.
      await command.run(message, commandArguments);
    }
  }
}

export default onMessage;
