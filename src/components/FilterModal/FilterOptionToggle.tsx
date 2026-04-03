import { Chip } from "@mui/material";
import type {FilterOptionToggleProps} from "@/utils/interfaces";


export default function FilterOptionToggle({
    label, 
    value,
    icon, 
    isSelected,
    onClick, 
}: FilterOptionToggleProps) {

    return (
        <Chip
            label={label}
            icon={icon}
            onClick={() => onClick(value)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              px: 1,
              py: 2.5,
              minWidth: 70,
              justifyContent: "center",
              border: 1,
              borderColor: isSelected ? "primary.main" : "divider",
              color: isSelected ? "primary.main" : "text.primary",
              bgcolor: isSelected ? "primary.light" : "transparent",
              "& .MuiChip-icon": {
                color: isSelected ? "primary.main" : "text.secondary",
              },
            }}
          />
    )
}