import { content as _content, plugin } from "flowbite-react/tailwind";
import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    _content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(),
  ],
})

