import { type Config } from "drizzle-kit";
//import {config} from 'dotenv' ; 
import { env } from "~/env";
//config({ path: '.env' });

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["hack2025_*"],
} satisfies Config;
