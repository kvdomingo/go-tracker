import { Button, Grid } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

function OrderTableToolbar() {
  return (
    <GridToolbarContainer>
      <Grid container>
        <Grid item xs>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Grid>
        <Grid item xs container justifyContent="flex-end">
          <Button variant="text" size="small" startIcon={<AddIcon />} sx={{ mr: 2 }}>
            Add Provider
          </Button>
          <Button variant="text" size="small" startIcon={<AddIcon />}>
            Add Order
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

export default OrderTableToolbar;
