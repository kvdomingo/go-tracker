import { useContext, useMemo, useReducer } from "react";

import TrackerContext, {
  PayloadAction,
  TrackerState,
} from "../contexts/TrackerContext";

export const updateProviders = "updateProviders";

export const updateOrders = "updateOrders";

export const updateShowCompleted = "updateShowCompleted";

const initialState: TrackerState = {
  providers: [],
  orders: [],
  showCompleted: false,
};

const reducer = (state: TrackerState, action: PayloadAction) => {
  switch (action.type) {
    case updateProviders: {
      return { ...state, providers: action.payload };
    }
    case updateOrders: {
      return { ...state, orders: action.payload };
    }
    case updateShowCompleted: {
      return { ...state, showCompleted: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};

function TrackerProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}

const TrackerConsumer = TrackerContext.Consumer;

const useTrackerContext = () => useContext(TrackerContext);

const trackerContextValue = {
  state: initialState,
  dispatch: reducer,
};

export {
  TrackerContext,
  TrackerConsumer,
  useTrackerContext,
  trackerContextValue,
};

export default TrackerProvider;
