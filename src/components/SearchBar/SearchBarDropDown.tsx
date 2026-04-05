import {
    Typography,
    Box,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import type { SearchBarDropDownProps } from "@/utils/interfaces";

export default function SearchBarDropDown({
    hasKeyword,
    locationsIsFetching,
    locationsError,
    locations,
    onLocationClick,
}: SearchBarDropDownProps) {

    const hasResults = locations && locations.length > 0;

    if (!hasKeyword) {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 5,
              px: 3,
              gap: 1,
            }}
          >
            <InfoIcon sx={{ fontSize: 36, color: "primary.main" }} />
            <Typography variant="subtitle2" fontWeight={500}>
              Start typing to search
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Enter a location, property name, or area to find properties
            </Typography>
          </Box>
        );
      }
  
      if (locationsIsFetching) {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        );
      }
  
      if (locationsError) {
        return (
          <Box sx={{ py: 3, px: 2, textAlign: "center" }}>
            <Typography variant="body2" color="error">
              Something went wrong. Please try again.
            </Typography>
          </Box>
        );
      }
  
      if (!hasResults) {
        return (
          <Box sx={{ py: 3, px: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No results found
            </Typography>
          </Box>
        );
      }
  
      return (
        <>
          <Typography
            variant="subtitle1"
            sx={{ 
              color: "primary.main", 
              fontWeight: 500,
              px: 2, 
              pt: 2, 
              pb: 1,
            }}
          >
            Top Suggestions
          </Typography>
          <List disablePadding>
            {locations.map((item) => (
              <ListItemButton
                key={item.slug}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": { bgcolor: "primary.light" },
                }}
                onClick={() => onLocationClick(item)}
              >
                <ListItemText
                  primary={item.title}
                />
                <Chip
                  label={item.type}
                  size="small"
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontSize: "0.75rem",
                    height: 24,
                    textTransform: "capitalize",
                    borderRadius: 2,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </>
      );
}