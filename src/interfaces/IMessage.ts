/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { GuildEmoji, Message } from 'discord.js';
import Bot from '@Bot';
import ISetting from './ISetting';

interface IMessage extends Message {
  /**
   * Official color.
   * @property
   */
  color: string;

  /**
   * Bot Manager.
   * @property
   */
  bot: Bot;

  /**
   * 'no' emoji for reactions.
   * @property
   */
  noEmoji: GuildEmoji | null;

  /**
   * 'yes' emoji for reactions.
   * @property
   */
  yesEmoji: GuildEmoji | null;

  /**
   * Get the developer role from the database.
   * 
   * @async
   * @function
   * @returns { Promise<ISetting | null> }
   */
  getDevRole(): Promise<ISetting | null>;

  /**
   * Send a message to the current channel and delete it in five seconds.
   * 
   * @async
   * @function
   * @param { string } message
   * @returns { Promise<void> }
   */
  sendAndDestroyInFiveSeconds(message: string): Promise<void>;
}

export default IMessage;
