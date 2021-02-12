import { createSlice } from "@reduxjs/toolkit";
import config from "../config/all";
import log from "loglevel";

// Creating Reducer And Actions
const slice = createSlice({
	name: "todoLists",
	initialState: {
		list: [],
	},
	reducers: {
		// todo Lists
		todoListAdded: (todoLists, action) => {
			todoLists.list.push({
				name: action.payload.name,
				createdAt: Date.now(),
				modifiedAt: Date.now(),
				cards: [],
			});
		},

		todoListNameEdited: (todoLists, action) => {
			todoLists.list[action.payload.todoListIndex].name = action.payload.name;
		},
		todoListDeleted: (todoLists, action) => {
			todoLists.list.splice(action.payload.todoListIndex, 1);
		},

		// todo Cards
		todoCardAdded: (todoLists, action) => {
			todoLists.list[action.payload.todoListIndex].cards.push({
				name: action.payload.name,
				createdAt: Date.now(),
				modifiedAt: Date.now(),
				isDragging: false,
			});
		},
		todoCardEdited: (todoLists, action) => {
			if (typeof action.payload.card.name !== "undefined") todoLists.list[action.payload.todoListIndex].cards[action.payload.todoCardIndex].name = action.payload.card.name;
			if (typeof action.payload.card.isDragging !== "undefined") todoLists.list[action.payload.todoListIndex].cards[action.payload.todoCardIndex].isDragging = action.payload.card.isDragging;
			if (typeof action.payload.card.modifiedAt !== "undefined") todoLists.list[action.payload.todoListIndex].cards[action.payload.todoCardIndex].modifiedAt = action.payload.card.modifiedAt;
		},
		todoCardDeleted: (todoLists, action) => {
			todoLists.list[action.payload.todoListIndex].cards.splice(action.payload.todoCardIndex, 1);
		},
		todoCardMoved: (todoLists, action) => {
			const draggedTodoCard = todoLists.list[action.payload.draggedCard.listIndex].cards[action.payload.draggedCard.cardIndex];
			todoLists.list[action.payload.draggedCard.listIndex].cards.splice(action.payload.draggedCard.cardIndex, 1);
			todoLists.list[action.payload.droppedPosition.listIndex].cards.splice(action.payload.droppedPosition.cardIndex, 0, draggedTodoCard);
		},

		// loading And Saving
		todoListsLoaded: (todoLists, action) => {
			return action.payload;
		},
	},
});

// Exporting
const { todoListAdded, todoListNameEdited, todoListDeleted, todoListsLoaded, todoCardAdded, todoCardEdited, todoCardMoved, todoCardDeleted } = slice.actions;
export const { name: sliceName } = slice;
export default slice.reducer;

// ============== Action Creators ================ //

// todo List
export const addTodoList = (listName) => todoListAdded({ name: listName });
export const editTodoListName = (todoListIndex, listName) => todoListNameEdited({ todoListIndex: todoListIndex, name: listName });
export const deleteTodoList = (todoListIndex) => todoListDeleted({ todoListIndex: todoListIndex });

// Todo Cards
export const addTodoCard = (todoListIndex, cardName) => todoCardAdded({ todoListIndex: todoListIndex, name: cardName });
export const editTodoCard = (todoListIndex, todoCardIndex, card) => todoCardEdited({ todoListIndex: todoListIndex, todoCardIndex: todoCardIndex, card: card });
export const deleteTodoCard = (todoListIndex, todoCardIndex) => todoCardDeleted({ todoListIndex: todoListIndex, todoCardIndex: todoCardIndex });
export const moveTodoCard = (draggedCard, droppedPosition) => todoCardMoved({ draggedCard: draggedCard, droppedPosition: droppedPosition });

// Saving and Loading Todo Lists
export const loadTodoLists = () => (dispatch, getState) => {
	try {
		const state = JSON.parse(localStorage.getItem(config.store.todosLocalStorageKey));
		if (state === null) return;
		return dispatch(todoListsLoaded(state));
	} catch (error) {
		log.log("No todoLists State in LocalStorage Found");
		return;
	}
};

export const saveTodoLists = () => (dispatch, getState) => {
	localStorage.setItem(config.store.todosLocalStorageKey, JSON.stringify(getState().entities.todoLists));
};
