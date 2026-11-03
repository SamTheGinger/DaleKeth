import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: false,
  // Non-default branches created via `neon checkout` expire after 7 days.
  branch: (branch) => (!branch.isDefault && !branch.exists ? { ttl: "7d" } : {}),
});
