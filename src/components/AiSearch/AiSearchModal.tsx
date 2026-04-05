import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import { useAiGeneration } from "@/hooks/useAiGeneration";

export default function AiSearchModal() {
  const { modalOpen, setModalOpen, register, onSubmit, formErrors, mutation } =
    useAiGeneration();

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          textTransform: "none",
          fontWeight: 600,
          gap: 1,
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        <AutoAwesomeIcon />
        Search with AI
      </Fab>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
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
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Search with AI
            </Typography>
          </Box>
          <IconButton
            onClick={() => setModalOpen(false)}
            size="small"
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <form onSubmit={onSubmit}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              Describe the property you&apos;re looking for and our AI will find
              the best matching filters for you.
            </Typography>

            <TextField
              {...register("description")}
              multiline
              rows={4}
              fullWidth
              placeholder="e.g. a fully furnished 2-bedroom condo under RM 3000/month for rent"
              error={!!formErrors.description}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {formErrors.description && (
              <Typography variant="body2" color="error">
                {formErrors.description.message}
              </Typography>
            )}

            {mutation.error && (
              <Alert severity="error" variant="outlined">
                {mutation.error.message}
              </Alert>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              sx={{
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              startIcon={
                mutation.isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {mutation.isPending ? "Searching..." : "Search"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
