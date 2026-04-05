import type { ListingCardProps } from "@/utils/interfaces";
import { Card, Box, Typography, IconButton } from "@mui/material";
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
  getUserInitials,
} from "@/utils/functions";
import Image from "next/image";
import { useState } from "react";

export default function ListingCard({
  isVertical,
  imgUrl,
  eagerLoadImg,
  price,
  name,
  address,
  bedRomms,
  bathRooms,
  floorSize,
  account,
}: ListingCardProps) {
  const iconSx = { fontSize: 18, color: "text.secondary" };
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const formattedPrice = getFormattedPrice(price);
  const formattedPricePsf = getFormattedPricePsf(floorSize, price);
  const initials = getUserInitials(account.name);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        borderRadius: 3,
        overflow: "hidden",
        maxWidth: "100%",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        bgcolor: "background.default",
        border: 1,
        borderColor: "divider",
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
          sx={{
            position: "relative",
            backgroundColor: "divider",
            minHeight: 220,
          }}
        >
          <Image
            loading={eagerLoadImg ? "eager" : "lazy"}
            src={imgSrc}
            alt={name}
            onError={() => setImgSrc("/placeholder.png")}
            style={{
              objectFit: "cover",
            }}
            fill
            sizes="(max-width: 599px) 100vw, (max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
          />
        </Box>
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
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: isVertical ? "flex-start" : "center",
            flex: 1,
            gap: 1.5,
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon sx={iconSx} />
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
              icon={<SquareFootIcon sx={iconSx} />}
              label={formattedPricePsf}
            />
          )}
        </Box>
        <Box
          sx={{
            mt: isVertical ? 1 : 3,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            backgroundColor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "text.primary",
              width: 40,
              height: 40,
              bgcolor: "#E65100",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </Box>
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
            href={`https://wa.me/${account.phone.slice(1)}`}
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
