import { Box, Typography } from "@mui/material";
import type { ListingCardStatItemProps } from "@/utils/interfaces";

export default function ListingCardStatItem({
    icon,
    label,
    }: ListingCardStatItemProps) {
    return (
        <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 0.5 }}
        >
            {icon}
            <Typography 
                variant="body2" 
                color="text.secondary"
            >
              {label}
            </Typography>
        </Box>
    );
  }