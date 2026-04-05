import { useState } from "react";
import { Box, Typography, Grid, Pagination, Button, Badge } from "@mui/material";
import { useRouter } from "next/router";
import ListingCard from "./ListingCard/FilterCard";
import Menu from "./Menu";
import ViewSelector from "./ViewSelector";
import { useListingsSort } from "@/hooks/useListingsSort";
import { LISTINGS_SORT_OPTIONS } from "@/utils/constants";
import type { ListingsResponse } from "@/utils/types";

export default function ListingsGrid({ data }: { data: ListingsResponse }) {

  const router = useRouter();
  const [isVerticalView, setIsVerticalView] = useState(true);
  const { selectedSort, handleSortChange, clearSort } = useListingsSort();

  return (
    <Box>
      <Box
        sx={{
          display: data.items.length > 0 ? "flex" : "none",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {data._meta.totalCount.toLocaleString()} Properties for Sale in Malaysia
        </Typography>

        <Box 
        sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          alignItems: "center", 
          gap: 1.5 
        }}>
          
          <Menu
            items={LISTINGS_SORT_OPTIONS}
            selectedItem={selectedSort}
            onItemSelect={handleSortChange}
            onClear={clearSort}
            title="Sort By"
          />
          <Box
          sx={{
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
          >
            <ViewSelector
              isVerticalView={isVerticalView}
              onChange={setIsVerticalView}
              />
          </Box>
        </Box>
      </Box>

      <Grid
      container
      spacing={2}
      >
        {data.items.length > 0 ? (data.items.map((item, index) => (
          <Grid
            key={item.id}
            size={{
              xs: 12,
              sm: isVerticalView ? 6 : 12,
              md: isVerticalView ? 4 : 12,
              lg: isVerticalView? 3 : 12,
            }}
            sx={{
              "& .MuiCard-root": { 
                maxWidth: "100%", 
                width: "100%",
                height: "100%"
              },
            }}
          >
            <ListingCard
              isVertical={isVerticalView}
              imgUrl={item.image}
              eagerLoadImg={index <= 8}
              price={item.price}
              name={item.name}
              address={`${item.city}, ${item.postcode}, ${item.state}, ${item.country}`}
              bedRomms={item.bedRooms}
              bathRooms={item.bathRooms}
              floorSize={item.floorSize}
              account={{
                name: item.account.name,
                phone: item.account.phone,
              }}
            />
          </Grid>
        ))) : (
          <Box 
          sx={{ 
            display: "flex", 
            width: "100%",
            justifyContent: "center", 
            alignItems: "center",
            height: "100px" 
             }}>
            <Typography variant="body2" color="text.secondary">
              No results found
            </Typography>
          </Box>
        )}
      </Grid>

      {data._meta.pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 3 }}>
          <Pagination
            count={data._meta.pageCount}
            page={data._meta.currentPage}
            onChange={(_, page) => {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, page },
              });
            }}
            shape="circular"
            siblingCount={4}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 500,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#F1F1F1",
                color: "text.primary",
                "&:hover": { bgcolor: "#E5E5E5" },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
