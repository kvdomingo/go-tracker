import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GroupOrder } from "../../api/types/groupOrder";
import OrderTableToolbar from "./OrderTableToolbar";

interface Props {
  columns: GridColDef[];
  rows: any[];
  showOrderDialog: () => void;
}

function OrderTable({ columns, rows, showOrderDialog }: Props) {
  return (
    <DataGrid
      autoHeight
      columns={columns}
      rows={[...rows]}
      components={{ Toolbar: () => <OrderTableToolbar showOrderDialog={showOrderDialog} /> }}
      getRowId={(row: GroupOrder) => row.pk}
      experimentalFeatures={{ newEditingApi: true }}
      disableSelectionOnClick
    />
  );
}

export default OrderTable;
