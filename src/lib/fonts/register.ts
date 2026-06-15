import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.woff", fontWeight: 400 },
    { src: "/fonts/Inter-Bold.woff", fontWeight: 700 },
    { src: "/fonts/Inter-Italic.woff", fontWeight: 400, fontStyle: "italic" },
  ],
});
