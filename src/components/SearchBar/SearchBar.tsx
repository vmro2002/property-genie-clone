import { useState, useRef } from "react";
import {
  Box,
  InputBase,
  Popper,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchLocationsQuery } from "@/hooks/useSearchLocationsQuery";
import { useSearchForm } from "@/hooks/useSearchForm";
import SearchBarDropDown from "./SearchBarDropDown";

export default function SearchBar() {
  const { register, setValue, onSubmit, keyword, onLocationClick } =
    useSearchForm();

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { locations, locationsIsFetching, locationsError, debouncedValue } =
    useSearchLocationsQuery(keyword);

  const hasKeyword = debouncedValue.length > 0;

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          component="form"
          onSubmit={async (e: React.SubmitEvent) => {
            await onSubmit(e);
            setIsFocused(false);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            border: 1,
            borderColor: "divider",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            borderBottomLeftRadius: isFocused ? "0px" : "24px",
            borderBottomRightRadius: isFocused ? "0px" : "24px",
            boxShadow: "rgb(170, 170, 170) 1px 1px 5px",
            px: 2,
            py: 1.25,
            gap: 1,
            transition: "border-radius 0.1s",
          }}
        >
          <LocationOnOutlinedIcon
            sx={{ color: "primary.main", fontSize: 22 }}
          />
          <InputBase
            placeholder="Search by location, area or landmark"
            fullWidth
            {...register("q")}
            onFocus={() => setIsFocused(true)}
            sx={{ fontSize: "0.95rem" }}
            autoComplete="off"
          />
          {hasKeyword && (
            <IconButton size="small" onClick={() => setValue("q", "")}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Popper
          open={isFocused}
          anchorEl={containerRef?.current}
          placement="bottom-start"
          disablePortal
          style={{
            width: containerRef?.current?.offsetWidth,
            zIndex: 1300,
          }}
        >
          <Box
            onMouseDown={(e) => e.preventDefault()}
            sx={{
              bgcolor: "background.default",
              borderBottomLeftRadius: "24px",
              borderBottomRightRadius: "24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              overflowY: "scroll",
              maxHeight: "300px",
            }}
          >
            <SearchBarDropDown
              hasKeyword={hasKeyword}
              locationsIsFetching={locationsIsFetching}
              locationsError={locationsError}
              locations={locations}
              onLocationClick={(location) => onLocationClick(location)}
            />
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
