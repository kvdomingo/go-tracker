import { Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import {
  updateShowCompleted,
  useTrackerContext,
} from "@/providers/TrackerProvider";

interface Props {
  showOrderDialog: () => void;
  showProviderDialog: () => void;
}

function OrderTableToolbar({ showOrderDialog, showProviderDialog }: Props) {
  const {
    state: { showCompleted },
    dispatch,
  } = useTrackerContext();

  function handleToggleShowCompleted() {
    dispatch({
      type: updateShowCompleted,
      payload: !showCompleted,
    });
  }

  return (
    <GridToolbarContainer>
      <Grid item xs>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Box sx={{ display: "inline", mx: 2 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showCompleted}
                onChange={handleToggleShowCompleted}
              />
            }
            label={
              <Typography variant="button">Show delivered orders</Typography>
            }
          />
        </Box>
      </Grid>
      <Grid item xs container justifyContent="flex-end">
        <Button
          variant="text"
          size="small"
          startIcon={<AddIcon />}
          className="mr-2"
          onClick={showProviderDialog}
        >
          Add Shop
        </Button>
        <Button
          variant="text"
          size="small"
          className="mr-2"
          startIcon={<AddIcon />}
          onClick={showOrderDialog}
        >
          Add Order
        </Button>
      </Grid>
    </GridToolbarContainer>
  );
}

export default OrderTableToolbar;
