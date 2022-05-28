import dateFormat from "dateformat";
import { GridColDef } from "@mui/x-data-grid";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { ReverseOrderStatus } from "../../api/types/groupOrder";

const columnDefinitions: GridColDef[] = [
  {
    field: "item",
    headerName: "Item",
    flex: 1,
    type: "string",
  },
  {
    field: "provider",
    headerName: "Provider",
    flex: 1,
    type: "string",
    valueGetter: params => params.value.name,
  },
  {
    field: "order_number",
    headerName: "Order Number",
    flex: 1,
    type: "string",
  },
  {
    field: "order_date",
    headerName: "Order Date",
    flex: 1,
    type: "date",
    valueFormatter: params => dateFormat(new Date(params.value), "dd mmm yyyy"),
  },
  {
    field: "downpayment_deadline",
    headerName: "Downpayment Deadline",
    flex: 1,
    type: "date",
    valueFormatter: params => (params.value ? dateFormat(new Date(params.value), "dd mmm yyyy") : "N/A"),
  },
  {
    field: "payment_deadline",
    headerName: "Payment Deadline",
    flex: 1,
    type: "date",
    valueFormatter: params => dateFormat(new Date(params.value), "dd mmm yyyy"),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    type: "string",
    editable: true,
    renderCell: params => (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ReverseOrderStatus[params.value].color,
          color: "white",
        }}
      >
        {ReverseOrderStatus[params.value].label}
      </Box>
    ),
    renderEditCell: params => (
      <FormControl fullWidth>
        <Select value={params.value}>
          {ReverseOrderStatus.map((status, i) => (
            <MenuItem key={status.label} value={i}>
              {status.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
  },
];

export default columnDefinitions;
