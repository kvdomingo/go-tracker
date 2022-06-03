import { useEffect, useState } from "react";
import { useTrackerContext } from "../../providers/TrackerProvider";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GroupOrder } from "../../api/types/groupOrder";
import OrderTableToolbar from "./OrderTableToolbar";

interface Props {
  columns: GridColDef[];
  showOrderDialog: () => void;
  showProviderDialog: () => void;
}

function OrderTable({ columns, showOrderDialog, showProviderDialog }: Props) {
  const { state } = useTrackerContext();
  const [rows, setRows] = useState<GroupOrder[]>([]);

  useEffect(() => {
    setRows(state.orders);
  }, [state.orders]);

  return (
    <DataGrid
      autoHeight
      columns={columns}
      rows={rows}
      components={{
        Toolbar: () => <OrderTableToolbar showOrderDialog={showOrderDialog} showProviderDialog={showProviderDialog} />,
      }}
      getRowId={(row: GroupOrder) => row.pk}
      experimentalFeatures={{ newEditingApi: true }}
      disableSelectionOnClick
    />
  );
}

export default OrderTable;
