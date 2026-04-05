import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

export default function ServerError() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>500 — Something went wrong | Property Genie Clone</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "min(60vh, 520px)",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            500
          </Typography>
          <CloudOffOutlinedIcon
            sx={{ fontSize: 56, color: "primary.main", opacity: 0.9 }}
            aria-hidden
          />
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            We couldn&apos;t load this page right now. It&apos;s usually temporary —
            try refreshing, or head back home to keep exploring listings.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              mt: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => router.reload()}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                borderColor: "divider",
                color: "text.primary",
              }}
            >
              Try again
            </Button>
            <Button
              component={Link}
              href="/"
              variant="contained"
              startIcon={<HomeOutlinedIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Back to home
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
