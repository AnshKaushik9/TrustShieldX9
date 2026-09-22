import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        muted: "var(--bg-muted)",
        "surface-hover": "var(--bg-hover)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        border: "var(--border-default)",
        "border-muted": "var(--border-muted)",
        success: {
          bg: "var(--status-success-bg)",
          text: "var(--status-success-text)",
          border: "var(--status-success-border)",
        },
        warning: {
          bg: "var(--status-warning-bg)",
          text: "var(--status-warning-text)",
          border: "var(--status-warning-border)",
        },
        danger: {
          bg: "var(--status-danger-bg)",
          text: "var(--status-danger-text)",
          border: "var(--status-danger-border)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
