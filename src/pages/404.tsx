import Head from "next/head";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page not found | Property Genie Clone</title>
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
            404
          </Typography>
          <SearchOffOutlinedIcon
            sx={{ fontSize: 56, color: "primary.main", opacity: 0.9 }}
            aria-hidden
          />
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Try going back home to continue browsing properties.
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            startIcon={<HomeOutlinedIcon />}
            sx={{
              mt: 1,
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
    </>
  );
}
