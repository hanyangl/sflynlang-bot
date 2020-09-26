/**
 * Copyright (c) Sflynlang
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import ISetting from "@Interfaces/ISetting";
import { connect, Model } from "mongoose";
import settings from "./models/settings";

/**
 * Database Manager.
 * @class
 */
class DatabaseManager {
  /**
   * Start the database manager and connect to the MongoDB database.
   *
   * @async
   * @function
   * @returns { Promise<void> }
   */
  async run(): Promise<void> {
    await connect(process.env.MONGODB || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Database connected!");
  }

  /**
   * Get the settings document.
   *
   * @function
   * @returns { Model<ISetting> }
   */
  getSettings(): Model<ISetting> {
    return settings;
  }

  /**
   * Get a setting by its key.
   *
   * @async
   * @function
   * @param { string } key
   * @returns { Promise<ISetting | null> }
   */
  async getSettingByKey(key: string): Promise<ISetting | null> {
    return await this.getSettings().findOne({ key });
  }
}

export default DatabaseManager;
