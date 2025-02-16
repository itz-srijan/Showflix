import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans all Next.js app directory files
    "./components/**/*.{js,ts,jsx,tsx}", // Scans components folder
    "./pages/**/*.{js,ts,jsx,tsx}", // (Optional) if using pages directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
