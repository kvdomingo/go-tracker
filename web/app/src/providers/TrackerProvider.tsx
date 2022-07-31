import { useContext, useReducer } from "react";
import TrackerContext, { PayloadAction, TrackerState } from "../contexts/TrackerContext";

export const updateProviders = "updateProviders";

export const updateOrders = "updateOrders";

const initialState: TrackerState = {
  providers: [],
  orders: [],
};

const reducer = (state: TrackerState, action: PayloadAction) => {
  switch (action.type) {
    case updateProviders: {
      return { ...state, providers: action.payload };
    }
    case updateOrders: {
      return { ...state, orders: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

function TrackerProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <TrackerContext.Provider value={{ state, dispatch }}>{children}</TrackerContext.Provider>;
}

const TrackerConsumer = TrackerContext.Consumer;

const useTrackerContext = () => useContext(TrackerContext);

const trackerContextValue = {
  state: initialState,
  dispatch: reducer,
};

export { TrackerContext, TrackerConsumer, useTrackerContext, trackerContextValue };

export default TrackerProvider;
