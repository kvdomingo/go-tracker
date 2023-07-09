import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { GroupOrder } from "@/api/types/groupOrder";
import { useTrackerContext } from "@/providers/TrackerProvider";

import OrderTableToolbar from "./OrderTableToolbar";

interface Props {
  columns: GridColDef[];
  showOrderDialog: () => void;
  showProviderDialog: () => void;
}

function OrderTable({ columns, showOrderDialog, showProviderDialog }: Props) {
  const {
    state: { orders },
  } = useTrackerContext();

  return (
    <DataGrid
      className="h-full w-full"
      autoPageSize
      disableRowSelectionOnClick
      columns={columns}
      rows={orders}
      slots={{ toolbar: OrderTableToolbar }}
      slotProps={{
        toolbar: { showOrderDialog, showProviderDialog },
      }}
      getRowId={(row: GroupOrder) => row.pk}
    />
  );
}

export default OrderTable;
