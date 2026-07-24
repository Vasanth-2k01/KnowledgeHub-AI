import { AppSettings, IAppSettings } from "@/models/AppSettings";
import connectDB from "@/config/db";

export class AppSettingsService {
  /**
   * Retrieves the application settings.
   * If no settings document exists, it automatically creates one with the defaults.
   */
  static async getSettings(): Promise<IAppSettings> {
    await connectDB();

    let settings = await AppSettings.findOne();

    if (!settings) {
      settings = new AppSettings();
      await settings.save();
    }

    return settings;
  }
}
