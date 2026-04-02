import type { ListingCardProps } from "@/utils/interfaces";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VerifiedIcon from "@mui/icons-material/Verified";
import ListingCardStatItem from "./ListingCardStatItem";
import { 
    getFormattedPricePsf, 
    getFormattedPrice, 
    getUserInitials 
} from "@/utils/functions";


export default function ListingCard({
  isVertical,
  imgUrl,
  price,
  name,
  address,
  bedRomms,
  bathRooms,
  floorSize,
  account,
}: ListingCardProps) {

  const iconSx = { fontSize: 18, color: "text.secondary" };

  const formattedPrice = getFormattedPrice(price);
  const formattedPricePsf = getFormattedPricePsf(floorSize, price);
  const initials = getUserInitials(account.name);


  return (
    <Card
      sx={{
        display: isVertical ? "block" : "flex",
        borderRadius: 3,
        overflow: "hidden",
        maxWidth: isVertical ? 340 : 720,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        bgcolor: "background.default",
        border: 1,
        borderColor: 'divider'
      }}
    >
        {/* Image section */}
        <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              ...(isVertical ? {} : { width: "35%" }),
            }}
        >
            <Box
              component="img"
              src={imgUrl}
              alt={name}
              sx={{
                width: "100%",
                height: isVertical ? 220 : "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            <Box
                sx={{
                position: "absolute",
                top: 16,
                left: 16,
                bgcolor: "primary.main",
                color: "white",
                px: 2,
                py: 0.75,
                borderRadius: 5,
                fontWeight: 700,
                fontSize: "0.875rem",
                }}
            >
                {formattedPrice}
            </Box>
        </Box>

        {/* Content section */}
        <Box
        sx={{
            flex: 1,
            flexDirection: 'column',
            // border: 1
        }}
        >
            <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  flex: 1,
                  justifyContent: "center",
                }}
            >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  {name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                  <LocationOnIcon
                    sx={{ fontSize: 18, color: "primary.main", mt: 0.25 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {address}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <ListingCardStatItem
                    icon={<KingBedOutlinedIcon sx={iconSx} />}
                    label={bedRomms}
                  />
                  <ListingCardStatItem
                    icon={<BathtubOutlinedIcon sx={iconSx} />}
                    label={bathRooms}
                  />
                  <ListingCardStatItem
                    icon={<SquareFootIcon sx={iconSx} />}
                    label={`${floorSize} sqft`}
                  />
                  {!isVertical && (
                      <ListingCardStatItem 
                          icon={<SquareFootIcon sx={iconSx} />}
                          label={formattedPricePsf} 
                      />
                  )}
                </Box>

                {isVertical && (
                  <ListingCardStatItem 
                      icon={<SquareFootIcon sx={iconSx}/>} 
                      label={formattedPricePsf} 
                  />
                )}
            </Box>
            <Box 
            sx={{ 
                px: 2.5,
                py: 1.5,
                display: "flex", 
                alignItems: "center", 
                alignSelf: 'end',
                gap: 1.5, 
                backgroundColor: "background.paper",
                border: 1,
                borderColor: 'divider'
            }}>
                <Avatar
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#E65100",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                }}
                >
                {initials}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                >
                    {account.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VerifiedIcon sx={{ fontSize: 14, color: "primary.main" }} />
                    <Typography variant="caption" sx={{ color: "primary.main" }}>
                    Verified Agent
                    </Typography>
                </Box>
                </Box>
                <IconButton
                component="a"
                href={`https://wa.me/${account.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    bgcolor: "#25D366",
                    color: "white",
                    "&:hover": { bgcolor: "#1DA851" },
                    width: 44,
                    height: 44,
                }}
                >
                <WhatsAppIcon />
                </IconButton>
            </Box>
        </Box>
    </Card>
  );
}
