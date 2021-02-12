import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodoList } from "./store/todoLists";
import { editSelectBgImgModal } from "./store/ui";
import TextareaAutosize from "react-textarea-autosize";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoList from "./layouts/TodoList/TodoList";
import { addOnEnter } from "./include/functions";
import TodoItemModal from "./components/TodoItemModal/TodoItemModal";
import SelectGbImgModal from "./components/SelectBgImgModal/SelectBgImgModal";
import "./style.scss";

export default function App() {
	const dispatch = useDispatch();
	const todoLists = useSelector((state) => state.entities.todoLists);
	const generalUi = useSelector((state) => state.ui.general);

	const mainContainerRef = useRef(null);
	const addTodoListTextAreaRef = useRef(null);
	const addTodoListButtonRef = useRef(null);

	const mainContainerStyles = {
		backgroundImage: generalUi.backgroundImage ? `url(${generalUi.backgroundImage})` : "",
	};

	function handleAddTodoList() {
		const newTodoListName = addTodoListTextAreaRef.current.value;
		if (newTodoListName === "") return;
		dispatch(addTodoList(newTodoListName));
		addTodoListTextAreaRef.current.value = "";
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<section className="mainContainer" ref={mainContainerRef} style={mainContainerStyles}>
				<section className="todoContainer" id="todocontainer">
					{todoLists.list.map((todoList, index) => {
						return <TodoList key={index} index={index} todoList={todoList} />;
					})}
				</section>
				<section className="addTodoList">
					<TextareaAutosize className="resetTextArea" ref={addTodoListTextAreaRef} onKeyPress={(e) => addOnEnter(e, addTodoListButtonRef)} placeholder="Enter list name" spellCheck="false" />
					<button ref={addTodoListButtonRef} onClick={handleAddTodoList}>
						Add List
					</button>
				</section>
				<section className="changeBg" onClick={() => dispatch(editSelectBgImgModal({ isOpen: true }))}>
					<i className="far fa-image"></i> Background Image
				</section>
			</section>
			<SelectGbImgModal />
			<TodoItemModal />
		</DndProvider>
	);
}
