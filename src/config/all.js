const config = {
	app: {
		rootElementId: "root",
	},
	store: {
		todosLocalStorageKey: "todoApp.todos",
		uiLocalStorageKey: "todoApp.ui",
	},
	logging: {
		isOn: false,
	},
	dnd: {
		types: {
			todoCard: "TODO_CARD",
		},
	},
	redux: {
		devTools: true,
	},
};

export default config;
