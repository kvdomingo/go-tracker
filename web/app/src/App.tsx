import { useEffect } from "react";
import { Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import OrderTableToolbar from "./components/shared/OrderTableToolbar";
import useGetProviders from "./api/hooks/useGetProviders";
import useGetGroupOrders from "./api/hooks/useGetGroupOrders";

function App() {
  const { data: providers, getProviders } = useGetProviders();
  const { data: orders, getGroupOrders } = useGetGroupOrders();
  const columns: GridColDef[] = [
    {
      field: "item",
      headerName: "Item",
      flex: 1,
      type: "string",
    },
  ];

  useEffect(() => {
    getProviders();
  }, []);

  useEffect(() => {
    getGroupOrders();
  }, []);

  return (
    <Container maxWidth={false}>
      <DataGrid columns={columns} rows={orders} components={{ Toolbar: OrderTableToolbar }} />
    </Container>
  );
}

export default App;
