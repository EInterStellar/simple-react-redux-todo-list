import { combineReducers } from "redux";

// Reducers
import todoListsReducer from "./todoLists";

const reducer = combineReducers({
	todoLists: todoListsReducer,
});

export default reducer;
