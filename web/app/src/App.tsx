import { useEffect, useMemo, useState } from "react";
import OrderTable from "./components/orderTable/OrderTable";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  ThemeProvider,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { GroupOrder, ReverseOrderStatus } from "./api/types/groupOrder";
import { Provider } from "./api/types/provider";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import dateFormat from "dateformat";
import OrderDialog from "./components/orderDialog/OrderDialog";
import theme from "./themes";
import api from "./api";

function App() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const columns: GridColumns<GroupOrder> = [
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
      // editable: true,
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
          {ReverseOrderStatus[params.value].label.replace("_", " ")}
        </Box>
      ),
      // renderEditCell: ({ value, row }) => (
      //   <FormControl fullWidth>
      //     <Select value={value} onChange={e => handlePatchOrder(row.pk, "status", e.target.value)}>
      //       {ReverseOrderStatus.map((status, i) => (
      //         <MenuItem key={status.label} value={i}>
      //           {status.label.replace("_", " ")}
      //         </MenuItem>
      //       ))}
      //     </Select>
      //   </FormControl>
      // ),
    },
    {
      field: "pk",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: params => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setIsEditing(true);
            setShowOrderDialog(true);
          }}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => {}} />,
      ],
    },
  ];

  useEffect(() => {
    Promise.all([api.provider.list(), api.groupOrder.list()])
      .then(([rProvider, rGroupOrder]) => {
        setProviders(rProvider.data);
        setOrders(rGroupOrder.data);
      })
      .catch(err => console.error(err));
  }, []);

  function handlePatchOrder(pk: string, key: keyof GroupOrder, value: GroupOrder[keyof GroupOrder]) {
    api.groupOrder
      .patch(pk, key, value)
      .then(res => {
        let orders_ = [...orders];
        let oldOrderIndex = orders_.findIndex(o => o.pk === pk);
        orders_[oldOrderIndex] = res.data;
        setOrders([...orders_]);
      })
      .catch(err => console.error(err));
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <OrderTable
          columns={columns}
          rows={orders}
          showOrderDialog={() => {
            setIsEditing(false);
            setShowOrderDialog(true);
          }}
        />
        <OrderDialog
          open={showOrderDialog}
          onClose={() => {
            setShowOrderDialog(false);
            setIsEditing(false);
          }}
          handleSubmit={() => {}}
          maxWidth="md"
          fullWidth
          isEditing={isEditing}
          providers={providers}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
