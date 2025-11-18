import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use DIRECT_URL for migrations (direct connection, port 5432)
    // DATABASE_URL is the pooler (port 6543) which doesn't support schema operations
    url: env("DIRECT_URL"),
  },
});
