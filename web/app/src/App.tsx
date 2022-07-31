import { useEffect, useState } from "react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Box, Container, ThemeProvider } from "@mui/material";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import dateFormat from "dateformat";
import api from "./api";
import { GroupOrder, ReverseOrderStatus } from "./api/types/groupOrder";
import OrderDialog from "./components/orderDialog/OrderDialog";
import OrderTable from "./components/orderTable/OrderTable";
import ProviderDialog from "./components/providerDialog/ProviderDialog";
import { updateOrders, updateProviders, useTrackerContext } from "./providers/TrackerProvider";
import theme from "./themes";

function App() {
  const { dispatch } = useTrackerContext();
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [editing, setEditing] = useState("");
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
      field: "total_balance",
      headerName: "Total Balance",
      flex: 1,
      type: "number",
      valueFormatter: ({ value }) => `P ${value.toFixed(2)}`,
    },
    {
      field: "remaining_balance",
      headerName: "Remaining Balance",
      flex: 1,
      type: "number",
      valueFormatter: ({ value }) => `P ${value.toFixed(2)}`,
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
            setEditing(params.id as string);
            setShowOrderDialog(true);
          }}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id as string)} />,
      ],
    },
  ];

  useEffect(() => {
    Promise.all([api.provider.list(), api.groupOrder.list()])
      .then(([rProvider, rGroupOrder]) => {
        dispatch({
          type: updateProviders,
          payload: rProvider.data,
        });
        dispatch({
          type: updateOrders,
          payload: rGroupOrder.data,
        });
      })
      .catch(err => console.error(err));
  }, [dispatch]);

  function handleDelete(pk: string) {
    api.groupOrder
      .delete(pk)
      .then(() => {
        api.groupOrder
          .list()
          .then(res =>
            dispatch({
              type: updateOrders,
              payload: res.data,
            }),
          )
          .catch(err => {
            console.error(err.message);
            alert("A network error occurred.");
          });
      })
      .catch(err => {
        console.error(err.message);
        alert("A network error occurred.");
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <OrderTable
          columns={columns}
          showOrderDialog={() => {
            setEditing("");
            setShowOrderDialog(true);
          }}
          showProviderDialog={() => setShowProviderDialog(true)}
        />
        <OrderDialog
          open={showOrderDialog}
          onClose={() => {
            setShowOrderDialog(false);
            setEditing("");
          }}
          maxWidth="md"
          fullWidth
          editing={editing}
        />
        <ProviderDialog
          open={showProviderDialog}
          onClose={() => setShowProviderDialog(false)}
          maxWidth="md"
          fullWidth
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
