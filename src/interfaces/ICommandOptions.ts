/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * Command decorator options.
 * @interface
 */
interface ICommandOptions {
  /**
   * Command name.
   * @property
   */
  name: string;

  /**
   * Command description.
   * @property
   */
  description: string;
}

export default ICommandOptions;
