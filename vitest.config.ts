import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    // Agent worktrees are full repo copies; test them from inside the worktree.
    exclude: [...configDefaults.exclude, ".claude/**"],
  },
});
