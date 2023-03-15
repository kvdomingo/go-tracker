import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GroupOrder } from "../../api/types/groupOrder";
import { useTrackerContext } from "../../providers/TrackerProvider";
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
      sx={{ height: "100vh", width: "100%" }}
      autoPageSize
      columns={columns}
      rows={rows}
      slots={{
        toolbar: OrderTableToolbar,
      }}
      slotProps={{
        toolbar: { showOrderDialog, showProviderDialog },
      }}
      getRowId={(row: GroupOrder) => row.pk}
    />
  );
}

export default OrderTable;
