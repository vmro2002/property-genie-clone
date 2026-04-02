import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import CssBaseline from '@mui/material/CssBaseline';
import { theme, poppins } from "@/theme";
import Header from "@/components/Header";
import { Container } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Property Genie Clone</title>
        <meta name="description" content="Best real estate deals in Malaysia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={poppins.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
            <Container
            maxWidth="xl"
            sx={{
              marginTop: 4
            }}
            >
              <Component {...pageProps} />
            </Container>
        </ThemeProvider>
      </main>
  </>
);
}