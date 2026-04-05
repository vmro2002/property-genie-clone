import { Box, Typography } from "@mui/material";
import { usePropertySelector } from "@/hooks/usePropertySelector";

export default function PropertySectionSelector() {
  const { section, setSection } = usePropertySelector();

  return (
    <Box
      sx={{
        display: "flex",
        width: 'fit-contain',
        border: 1,
        borderColor: "primary.main",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setSection("sale")}
        sx={{
          flex: 1,
          py: 1.25,
          px: 2,
          border: "none",
          cursor: "pointer",
          bgcolor: section === "sale" ? "primary.main" : "background.paper",
          color: section === "sale" ? "#fff" : "primary.main",
          fontFamily: "inherit",
        }}
      >
        <Typography variant="body2" sx={{textWrap: 'nowrap'}}>
          For Sale
        </Typography>
      </Box>
      <Box
        component="button"
        type="button"
        onClick={() => setSection("rent")}
        sx={{
          flex: 1,
          py: 1.25,
          px: 2,
          border: "none",
          borderLeft: 1,
          borderColor: "primary.main",
          cursor: "pointer",
          bgcolor: section === "rent" ? "primary.main" : "background.paper",
          color: section === "rent" ? "#fff" : "primary.main",
          fontFamily: "inherit",
        }}
      >
        <Typography variant="body2" sx={{textWrap: 'nowrap'}}>
          For Rent
        </Typography>
      </Box>
    </Box>
  );
}
