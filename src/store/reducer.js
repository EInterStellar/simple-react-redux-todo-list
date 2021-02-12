import { combineReducers } from "redux";

// Reducers
import entitiesReducer from "./entities";
import uiReducer from "./ui";

const reducer = combineReducers({
	entities: entitiesReducer,
	ui: uiReducer,
});

export default reducer;
