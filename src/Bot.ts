/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import DiscordJS from 'discord.js';
import DatabaseManager from '@Database/Manager';
import CommandsManager from '@Commands/Manager';
import onMessage from '@Events/onMessage';
import onReady from '@Events/onReady';

/**
 * Bot Manager.
 * @class
 */
class Bot {
  private client: DiscordJS.Client;
  private database: DatabaseManager;
  private commands: CommandsManager;

  private prefix: string;

  constructor() {
    this.client = new DiscordJS.Client();
    this.database = new DatabaseManager();
    this.commands = new CommandsManager();

    this.prefix = '';
  }

  /**
   * Get the bot client.
   * 
   * @function
   * @returns { DiscordJS.Client }
   */
  getClient(): DiscordJS.Client {
    return this.client;
  }

  /**
   * Get the database manager.
   * 
   * @function
   * @returns { DatabaseManager }
   */
  getDatabase(): DatabaseManager {
    return this.database;
  }

  /**
   * Get the command manager.
   * 
   * @function
   * @returns { CommandsManager }
   */
  getCommands(): CommandsManager {
    return this.commands;
  }

  /**
   * Get the message prefix.
   * 
   * @function
   * @returns { string }
   */
  getPrefix(): string {
    return this.prefix;
  }

  /**
   * Start the bot application.
   * 
   * @async
   * @function
   * @returns { Promise<void> }
   */
  async run(): Promise<void> {
    // Load database.
    await this.getDatabase().run();

    // Get prefix.
    let prefixSetting = await this.getDatabase().getSettingByKey('prefix');

    if (!prefixSetting) {
      // Insert the default prefix to the database.
      prefixSetting = await this.getDatabase().getSettings().create({
        key: 'prefix',
        value: '!',
      });
    }

    this.prefix = prefixSetting.value;

    // Load commands.
    this.getCommands().run(this.getClient());

    // Set events.
    this.getClient().on('message', async (message) => await onMessage(this, message));
    this.getClient().on('ready', () => onReady(this));

    // Log the bot.
    await this.getClient().login(process.env.DISCORD_TOKEN);
  }
}

export default Bot;
