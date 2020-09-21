/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { ICommandMethods } from '@Interfaces/ICommand';
import ICommandOptions from '@Interfaces/ICommandOptions';

/**
 * Command class decorator.
 * 
 * @function
 * @param { ICommandOptions } options
 */
function command(
  options: ICommandOptions,
) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements ICommandMethods {
      readonly name: string = options.name;
      readonly description: string = options.description;
    };
  };
}

export default command;
