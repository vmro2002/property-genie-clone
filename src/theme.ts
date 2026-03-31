import { Poppins } from "next/font/google";
import { createTheme } from "@mui/material/styles";

export const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
})

export const theme = createTheme({
    typography: {
        fontFamily: `${poppins.style.fontFamily}, sans-serif`,
    },
})