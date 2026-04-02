import { Box, IconButton } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import type { ViewSelectorProps } from "@/utils/interfaces";

export default function ViewSelector({
  isVerticalView,
  onChange,
}: ViewSelectorProps) {

  const activeStyles = {
    px: 1,
    borderRadius: 0,
    bgcolor: "primary.main",
    color: "white",
    "&:hover": { bgcolor: "primary.main" },
  };

  const inactiveStyles = {
    px: 1,
    borderRadius: 0,
    bgcolor: "background.default",
    color: "text.secondary",
    "&:hover": { bgcolor: "action.hover" },
  };

  return (
    <Box 
      component='div'
      sx={{ 
        display: "flex", 
        borderRadius: 1,
        border: 1,
        borderColor: 'primary.main',
        overflow: 'hidden'
      }}>
      <IconButton
        onClick={() => onChange(true)}
        size="small"
        sx={{
          ...(isVerticalView ? activeStyles : inactiveStyles),
        }}
      >
        <GridViewRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={() => onChange(false)}
        size="small"
        sx={{
          p: 1,
          ...(!isVerticalView ? activeStyles : inactiveStyles),
        }}
      >
        <ViewListRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}