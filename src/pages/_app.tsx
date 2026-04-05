import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import CssBaseline from '@mui/material/CssBaseline';
import { theme, poppins } from "@/theme";
import Header from "@/components/Header";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "@/components/Loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // initial page load 
    setLoading(false)

    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Property Genie Clone</title>
        <meta name="description" content="Best real estate deals in Malaysia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider
      client={queryClient}
      >
        <main className={poppins.className}>
          {loading? (
            <Loader />
          ) : (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header />
              <Container
              maxWidth="xl"
              sx={{
                marginY: 4
              }}
              >
                <Component {...pageProps} />
              </Container>
            </ThemeProvider>
              )}
        </main>
      </QueryClientProvider>
  </>
);
}