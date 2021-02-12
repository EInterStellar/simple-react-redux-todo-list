import { sliceName, saveTodoLists } from "../todoLists";
const saveTodoListsOnChange = ({ dispatch }) => (next) => (action) => {
	next(action);
	if (action.type.indexOf(sliceName) !== 0) return;
	dispatch(saveTodoLists());
};

export default saveTodoListsOnChange;
