import { combineReducers } from "redux";
import EmployeeReducer from "./EmployeeReducer";

const RootReducer = combineReducers({
  employee: EmployeeReducer,
});

export default RootReducer;