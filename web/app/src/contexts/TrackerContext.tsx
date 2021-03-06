import { createContext } from "react";
import { GroupOrder } from "../api/types/groupOrder";
import { Provider } from "../api/types/provider";

export interface TrackerState {
  providers: Provider[];
  orders: GroupOrder[];
}

export interface PayloadAction {
  type: string;
  payload: any;
}

interface CreateTrackerContext {
  state: TrackerState;
  dispatch: (action: PayloadAction) => void;
}

const TrackerContext = createContext<CreateTrackerContext>({
  state: {
    providers: [],
    orders: [],
  },
  dispatch: () => {},
});

export default TrackerContext;
