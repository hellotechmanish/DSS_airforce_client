/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        33.75: "135px",
      },
      // Ise add karein taaki min-w-27.5 kaam kare
      minWidth: {
        27.5: "110px",
      },
    },
  },
  plugins: [],
};
