import { useState, useRef } from "react";
import {
  Button,
  Popper,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ClickAwayListener,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import type { MenuProps } from "@/utils/interfaces";

export default function Menu({
  items,
  selectedItem,
  onItemSelect,
  onClear,
  title,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = items.find((i) => i.value === selectedItem)?.label ?? title ?? "Select";

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box ref={containerRef} sx={{ position: "relative" }}>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          variant="outlined"
          startIcon={<FilterListIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            borderColor: "divider",
            color: "text.primary",
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <Typography
          sx={{
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
          >
            {selectedLabel}
          </Typography>
        </Button>

        <Popper
          open={isOpen}
          placement="bottom-end"
          anchorEl={containerRef.current}
          disablePortal
          sx={{ zIndex: 1300 }}
        >
            <Box
            component="div"
            sx={{
              borderRadius: 3,
              mt: 1,
              minWidth: 240,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              backgroundColor: "background.default",
              p: 2
            }}
            >
            {(title || onClear) && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                {title && (
                  <Typography variant="subtitle2" fontWeight={600}>
                    {title}
                  </Typography>
                )}
                {onClear && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => {
                      onClear();
                      setIsOpen(false);
                    }}
                  >
                    Clear
                  </Typography>
                )}
              </Box>
            )}

            <Divider/>

            <List>
              {items.map((item) => (
                <ListItemButton
                  key={item.value}
                  selected={item.value === selectedItem}
                  onClick={() => {
                    onItemSelect(item.value);
                    setIsOpen(false);
                  }}
                  sx={{
                    borderRadius: 3,
                    py: 1,
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: 'primary.light',
                    },
                    "&.Mui-selected": {
                      bgcolor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                  />
                  {item.value === selectedItem && (
                    <CheckIcon
                      sx={{ fontSize: 18, color: "primary.main"}}
                    />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
