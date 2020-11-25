import { createStore, applyMiddleware, compose } from "redux";
import ReduxThunk from "redux-thunk";
import reducer from "./rootReducer";

const enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  : (x: any) => x;

export const store = createStore(reducer, enhancer);
