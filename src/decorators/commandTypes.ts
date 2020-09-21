/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import ICommandType from '@Interfaces/ICommandType';

function commandType<T extends { new (...args: any[]): {} }>(
  constructor: T,
  type: ICommandType,
) {
  return class extends constructor {
    readonly type: ICommandType = type;
  }
}

/**
 * Developer command decorator.
 * 
 * @function
 * @param constructor
 */
export function developer<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return commandType<T>(constructor, ICommandType.DEVELOPER);
}

/**
 * General command decorator.
 * 
 * @function
 * @param constructor
 */
export function general<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return commandType<T>(constructor, ICommandType.GENERAL);
}

/**
 * Moderator command decorator.
 * 
 * @function
 * @param constructor
 */
export function moderator<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return commandType<T>(constructor, ICommandType.MODERATOR);
}
