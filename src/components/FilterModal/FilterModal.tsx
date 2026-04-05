import {
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useFilterForm } from "@/hooks/useFilterForm";
import {
  LISTING_CATEGORIES,
  LISTING_TYPES,
  LISTING_BEDROOMS,
  LISTING_BATHROOMS,
  LISTING_FURNISHINGS,
} from "@/utils/constants";
import { capitalizeFirstLetter, safeParseFloat } from "@/utils/functions";
import FilterOptionToggle from "./FilterOptionToggle";

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  residential: <HomeOutlinedIcon sx={{ fontSize: 18 }} />,
  condo: <ApartmentOutlinedIcon sx={{ fontSize: 18 }} />,
  flat: <ViewQuiltOutlinedIcon sx={{ fontSize: 18 }} />,
  room: <MeetingRoomOutlinedIcon sx={{ fontSize: 18 }} />,
};

export default function FilterModal() {
  const {
    register,
    setValue,
    errors,
    applyFilters,
    clearFilters,
    categories,
    showPropertyTypes,
    propertyTypes,
    togglePropertyType,
    bedRooms,
    toggleBedrooms,
    bathRooms,
    toggleBathrooms,
    furnishings,
    toggleFurnishings,
    filterOpen,
    setFilterOpen,
    handleCloseFilter,
    activeFilterCount,
  } = useFilterForm();

  return (
    <>
    <Badge
      badgeContent={activeFilterCount}
      color="primary"
      invisible={activeFilterCount === 0}
    >
      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={() => setFilterOpen(true)}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.primary",
          borderRadius: 2,
          px: 2,
          py: 1,
          fontWeight: 500,
        }}
      >
        Filters
      </Button>
    </Badge>
    <Dialog
      open={filterOpen}
      onClose={handleCloseFilter}
      maxWidth="sm"
      fullWidth
      sx={{
        borderRadius: 3,
        "& .MuiDialog-paper": {
          borderRadius: 3,
        }
      }}
      disableRestoreFocus
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TuneIcon />
          <Typography variant="h6" fontWeight={600}>
            Filter Properties
          </Typography>
        </Box>
        <IconButton onClick={handleCloseFilter} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        {/* Price Range */}
        <Box>
          <Typography 
          variant="subtitle2" 
          fontWeight={500}
          fontSize={16}
          gutterBottom
          >
            Price Range
          </Typography>
          <Box 
          sx={{ 
            display: "flex", 
            gap: 2 
          }}
          >
            <Box 
            sx={{ 
              flex: 1 
            }}
            >
              <Typography 
              variant="body2" 
              gutterBottom
              >
                Minimum Price
              </Typography>
              <TextField
                fullWidth
                data-testid="min-price-input"
                type="number"
                size="small"
                placeholder="Select min price"
                {...register("minPrice", {
                  setValueAs: (value) => safeParseFloat(value),
                })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">RM</InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  }
                }}
                
              />
              {errors.minPrice && (
                <Typography variant="body2" color="error">
                  {errors.minPrice.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
              variant="body2" 
              fontSize={14}
              gutterBottom
              >
                Maximum Price
              </Typography>
              <TextField
                fullWidth
                data-testid="max-price-input"
                size="small"
                placeholder="Select max price"
                {...register("maxPrice", {
                  setValueAs: (value) => safeParseFloat(value),
                })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">RM</InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  }
                }}
              />
              {errors.maxPrice && (
                <Typography 
                variant="body2" 
                color="error"
                >
                  {errors.maxPrice.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Property Category */}
        <Box>
          <Typography 
          variant="subtitle2" 
          fontWeight={500}
          fontSize={16}
          gutterBottom
          >
            Property Category
          </Typography>
          <Box 
          sx={{ 
            display: "flex", 
            flexWrap: "wrap",
             gap: 1 
          }}
          >
            <FilterOptionToggle
            label="All Properties"
            value="all"
            icon={<CategoryOutlinedIcon sx={{ fontSize: 18 }} />}
            isSelected={!categories}
            onClick={() => {
              setValue("categories", undefined);
              setValue("types", []);
            }}
            />
            {LISTING_CATEGORIES.map((listingCategory) => (
                <FilterOptionToggle
                key={listingCategory}
                label={capitalizeFirstLetter(listingCategory)}
                value={listingCategory}
                icon={CATEGORY_ICONS[listingCategory]}
                isSelected={categories === listingCategory}
                onClick={() => setValue("categories", listingCategory)}
            />))}
          </Box>
        </Box>

        {/* Listing Types (conditional) */}
        {/* Only show if the selected category is residential */}
        {showPropertyTypes && (
          <>
          <Divider />
          <Box>
            <Typography 
            variant="body2"  
            color="text.secondary" 
            gutterBottom
            >
              Select Propety Types
            </Typography>

            <FormGroup
            sx={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 10,
              fontWeight: 500,
              "& .MuiFormControlLabel-label": {
                fontSize: 14,
                fontWeight: 600,
              }
            }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                  checked={propertyTypes?.length === 0}
                  onChange={() => setValue("types", [])}
                  sx={{
                    color: "divider",
                    "&.Mui-checked": { color: "primary.main" },
                  }}
                  size="small"
                  />
                }
                label='All Residential'
                />
              {LISTING_TYPES.map((listingType) => (
                <FormControlLabel
                key={listingType}
                control={
                  <Checkbox
                  checked={!!propertyTypes?.includes(listingType)}
                  onChange={() => togglePropertyType(listingType)}
                  sx={{
                    color: "divider",
                    "&.Mui-checked": { color: "primary.main" },
                  }}
                  size="small"
                  />
                }
                label={capitalizeFirstLetter(listingType)}
                />
              ))}
            </FormGroup>
          </Box>
          </>
        )}

        {/* Bedrooms */}
        <Box>
          <Typography 
          variant="subtitle2" 
          fontWeight={500}
          fontSize={16}
          gutterBottom
          >
            Bedrooms
          </Typography>
          <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
          >
            {LISTING_BEDROOMS.map((bedroom) => (
              <FilterOptionToggle
              key={bedroom.value}
              label={bedroom.label}
              value={bedroom.value}
              isSelected={!!bedRooms?.includes(bedroom.value)}
              onClick={() => toggleBedrooms(bedroom.value)}
            />
            ))}
          </Box>
        </Box>

        {/* Bathrooms */}
        <Box>
          <Typography 
          variant="subtitle2" 
          fontWeight={500}
          fontSize={16}
          gutterBottom
          >
            Bathrooms
          </Typography>
          <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
          >
            {LISTING_BATHROOMS.map((bathroom) => (
              <FilterOptionToggle
              key={bathroom}
              label={bathroom == 5? '5+' : String(bathroom)}
              value={bathroom}
              isSelected={!!bathRooms?.includes(bathroom)}
              onClick={() => toggleBathrooms(bathroom)}
            />
            ))}
          </Box>
        </Box>

        {/* Furnishings */}
        <Box>
          <Typography 
          variant="subtitle2" 
          fontWeight={500}
          fontSize={16}
          gutterBottom
          >
            Furnishings
          </Typography>
          <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
          >
            {LISTING_FURNISHINGS.map((furnishing) => (
              <FilterOptionToggle
              key={furnishing.value}
              label={furnishing.label}
              value={furnishing.value}
              isSelected={!!furnishings?.includes(furnishing.value)}
              onClick={() => toggleFurnishings(furnishing.value)}
            />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={clearFilters}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
            borderColor: "divider",
            color: "text.primary",
          }}
        >
          Clear All
        </Button>
        <Button
          variant="contained"
          onClick={applyFilters}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}