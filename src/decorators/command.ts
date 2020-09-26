/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { ICommandMethods } from "@Interfaces/ICommand";
import ICommandOptions from "@Interfaces/ICommandOptions";

/**
 * Add the name, description and arguments of the command to the
 * current class for the Help command.
 *
 * @function
 * @param { ICommandOptions } options
 */
function command(options: ICommandOptions) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements ICommandMethods {
      readonly name = options.name;
      readonly description = options.description;
      readonly arguments = options.arguments;
    };
  };
}

export default command;
