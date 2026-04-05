import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getListingsData } from "@/utils/functions";
import { ListingsResponse } from "@/utils/types";
import ListingsGrid from "@/components/ListingsGrid";
import { Box, Breadcrumbs, Typography, Button, Snackbar, Alert } from "@mui/material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import SearchBar from "@/components/SearchBar/SearchBar";
import Link from "next/link";
import { useRouter } from "next/router";
import FilterModal from "@/components/FilterModal/FilterModal";
import PropertySectionSelector from "@/components/PropertySectionSelector";
import SavedFiltersModal from "@/components/SavedFiltersModal/SavedFiltersModal";
import { useFilterSave } from "@/hooks/useFilterSave";
import AiSearchModal from "@/components/AiSearch/AiSearchModal";

export const getServerSideProps: GetServerSideProps<{
  data: ListingsResponse;
}> = async (ctx: GetServerSidePropsContext) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  const data = await getListingsData(ctx);

  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();
  const { q, state, city } = router.query;

  const {
    saveFilter,
    savedFilters,
    isEmpty,
    savedModalOpen,
    toast,
    closeToast,
    setSavedModalOpen,
    removeSavedFilter,
    applySavedFilter
  } = useFilterSave();

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}
    >
      {(q || city || state) && (
        <Breadcrumbs
        separator=">"
        sx={{
          color: 'primary.main'
        }}
        >
          <Link 
          href="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
          >
            Home
          </Link>
          <Typography 
          variant="body2" 
          color="text.secondary"
          >
            {q && `Search Results for "${q}"`}
            {city && city}
            {state && state}
          </Typography>

        </Breadcrumbs>
      )}
      <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
        gap: {
          xs: 2,
          md: 1
        }
      }}
      >
        <SearchBar/>
        <Box
        sx={{
          display: 'flex',
          flexWrap: {
            xs: 'wrap',
            sm: 'nowrap'
          },
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: {
              xs: 'wrap',
              sm: 'nowrap'
            }
          }}
          >
            <FilterModal />
            <PropertySectionSelector />
          </Box>
          <Box
           sx={{
            display: 'flex',
            gap: 1,
            flexWrap: {
              xs: 'wrap',
              sm: 'nowrap'
            }
          }}
          >
            <Button
              variant="outlined"
              startIcon={<BookmarkAddOutlinedIcon />}
              onClick={saveFilter}
              sx={{
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 500,
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<BookmarksOutlinedIcon />}
              onClick={() => setSavedModalOpen(true)}
              sx={{
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 500,
              }}
            >
              Saved
            </Button>
          </Box>
        </Box>
      </Box>
      <SavedFiltersModal
        open={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedItems={savedFilters}
        isEmpty={isEmpty}
        onDelete={(filterId) => removeSavedFilter(filterId)}
        onApply={(filterId) => applySavedFilter(filterId)}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <ListingsGrid data={data} />
      <AiSearchModal />
    </Box>
  )
}