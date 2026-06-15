import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.woff2", fontWeight: 400 },
    { src: "/fonts/Inter-Bold.woff2", fontWeight: 700 },
    { src: "/fonts/Inter-Italic.woff2", fontWeight: 400, fontStyle: "italic" },
  ],
});
