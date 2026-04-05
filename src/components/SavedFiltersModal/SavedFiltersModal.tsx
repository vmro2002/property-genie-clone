import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { formatFilterSummary } from "@/utils/functions";
import type { SavedFiltersModalProps } from "@/utils/interfaces";

export default function SavedFiltersModal({
  open,
  onClose,
  savedItems,
  isEmpty,
  onDelete,
  onApply,
}: SavedFiltersModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
        },
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
          <BookmarkBorderIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Saved searches
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2, minHeight: 120 }}>
        {isEmpty ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 4,
              px: 2,
              textAlign: "center",
            }}
          >
            <BookmarkBorderIcon sx={{ fontSize: 40, color: "text.disabled" }} />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              No saved searches yet
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={280}>
              Use &quot;Save search&quot; to store your current filters and
              keywords. They&apos;ll appear here for quick access.
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ width: "100%" }}>
            {savedItems.map((entry) => {
              const { primary, secondary } = formatFilterSummary(entry);
              return (
                <ListItem
                  key={entry.id}
                  disablePadding
                  sx={{ mb: 1 }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label="Delete saved search"
                      onClick={() => onDelete(entry.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => onApply(entry.id)}
                    alignItems="flex-start"
                    sx={{
                      borderRadius: 2,
                      border: 1,
                      borderColor: "divider",
                      pr: 6,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          textWrap: "wrap",
                        }}
                      >
                        {primary}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          textWrap: "wrap",
                        }}
                      >
                        {secondary}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
