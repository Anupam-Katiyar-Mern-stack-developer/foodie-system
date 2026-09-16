import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    const migrationFolder = path.join(
      __dirname,
      "migrationS"
    );

    const files = fs
      .readdirSync(migrationFolder)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      console.log(`Running: ${file}`);

      const filePath = path.join(
        migrationFolder,
        file
      );

      const sql = fs.readFileSync(
        filePath,
        "utf8"
      );

      await pool.query(sql);

      console.log(`Completed: ${file}`);
    }

    console.log("All migrations completed");
  } catch (error) {
    console.error(
      "Migration error:",
      error.message
    );
  } finally {
    await pool.end();
  }
};

runMigrations();