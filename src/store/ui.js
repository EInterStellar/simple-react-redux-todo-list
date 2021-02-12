import { createSlice } from "@reduxjs/toolkit";
import config from "../config/all";
import log from "loglevel";

// Creating Reducer And Actions
const slice = createSlice({
	name: "ui",
	initialState: {
		general: {
			backgroundImage: "",
		},
		todoCardModal: {
			isOpen: false,
			todoListIndex: 0,
			todoCardIndex: 0,
		},
		selectBgImgModal: {
			isOpen: false,
			images: importAllImages(require.context("../assets/images/backgroundImages/", false, /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)),
		},
	},
	reducers: {
		// Save ui status
		uiLoaded: (ui, action) => {
			if (typeof action.payload.general !== "undefined") ui.general = action.payload.general;
		},
		// Todo Modal
		todoCardModalEditted: (ui, action) => {
			if (typeof action.payload.modalInfo.isOpen !== "undefined") ui.todoCardModal.isOpen = action.payload.modalInfo.isOpen;
			if (typeof action.payload.modalInfo.todoListIndex !== "undefined") ui.todoCardModal.todoListIndex = action.payload.modalInfo.todoListIndex;
			if (typeof action.payload.modalInfo.todoCardIndex !== "undefined") ui.todoCardModal.todoCardIndex = action.payload.modalInfo.todoCardIndex;
		},
		// Select background image modal
		selectBgImgModalEditted: (ui, action) => {
			if (typeof action.payload.modalInfo.isOpen !== "undefined") ui.selectBgImgModal.isOpen = action.payload.modalInfo.isOpen;
		},
		// Background image changed
		backgroundImageChanged: (ui, action) => {
			ui.general.backgroundImage = action.payload.imageSrc;
		},
	},
});

// Exporting
const { uiLoaded, backgroundImageChanged, todoCardModalEditted, selectBgImgModalEditted } = slice.actions;
export default slice.reducer;

// ============== Action Creators ================ //
// Background image of app
export const changeBackgroundImage = (imageSrc) => (dispatch, getState) => {
	dispatch(backgroundImageChanged({ imageSrc: imageSrc }));
	dispatch(saveUi());
};
// Todo card modal
export const editTodoCardModal = (modalInfo) => todoCardModalEditted({ modalInfo: modalInfo });
// Select background image modal
export const editSelectBgImgModal = (modalInfo) => selectBgImgModalEditted({ modalInfo: modalInfo });

// Saving and Loading Ui Status
export const loadUi = () => (dispatch, getState) => {
	try {
		const state = JSON.parse(localStorage.getItem(config.store.uiLocalStorageKey));
		if (state === null) return;
		return dispatch(uiLoaded(state));
	} catch (error) {
		log.log("No ui State in LocalStorage Found");
		return;
	}
};

export const saveUi = () => (dispatch, getState) => {
	localStorage.setItem(config.store.uiLocalStorageKey, JSON.stringify(getState().ui));
};

// =========== Other functions =========== //
function importAllImages(r) {
	let images = {};
	r.keys().forEach((item) => {
		images[item.replace("./", "")] = r(item);
	});
	return images;
}
