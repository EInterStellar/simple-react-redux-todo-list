import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import config from "../config/all";
import reducer from "./reducer";

// Action Creators
import { loadTodoLists } from "./todoLists";
import { loadUi } from "./ui";

// Middlewares
import saveTodoListsOnChange from "./middleware/todoLists";

const store = configureStore({
	reducer,
	middleware: [...getDefaultMiddleware(), saveTodoListsOnChange],
	devTools: config.redux.devTools,
});

store.dispatch(loadTodoLists());
store.dispatch(loadUi());

export default store;
