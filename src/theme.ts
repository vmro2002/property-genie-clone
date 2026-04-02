import { Poppins } from "next/font/google";
import { createTheme } from "@mui/material/styles";

export const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export const theme = createTheme({
    typography: {
        fontFamily: `${poppins.style.fontFamily}, sans-serif`,
    },
    palette: {
        primary: {
            main: '#3462F4',
            light: '#3462F41A'
        },
        text: {
            primary: '#2C2C2C',
            secondary: '#64748B'
        },
        background: {
            default: '#FFFFFF',
            paper: '#F8FAFC',
        },
        divider: '#E2E8F0'
    },
})