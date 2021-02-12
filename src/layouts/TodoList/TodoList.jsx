import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTodoCard, deleteTodoList, editTodoListName, moveTodoCard } from "../../store/todoLists";
import { blurInputOnNewLine } from "../../include/functions";
import config from "../../config/all";
import TextareaAutosize from "react-textarea-autosize";
import { useDrop } from "react-dnd";
import TodoItem from "./components/TodoItem/TodoItem";
import { addOnEnter } from "../../include/functions";
import "./style.scss";

export default function TodoList({ todoList, index }) {
	const dispatch = useDispatch();

	const addTodoButtonRef = useRef(null);
	const addTodoTextAreaRef = useRef(null);
	const todosTitleRef = useRef(null);
	const todosBodyRef = useRef(null);

	useEffect(() => {
		todosTitleRef.current.value = todoList.name;
	}, [todoList.name]);

	// Add Todo Handler
	function handleAddTodo(e) {
		const newTodoName = addTodoTextAreaRef.current.value;
		if (newTodoName === "") return;

		dispatch(addTodoCard(index, newTodoName));

		addTodoTextAreaRef.current.value = "";
		addTodoTextAreaRef.current.focus();

		setTimeout(() => {
			todosBodyRef.current.scrollTo({
				left: 0,
				top: todosBodyRef.current.scrollHeight,
				behavior: "smooth",
			});
		}, 10);
	}

	function deleteButtonOnClick() {
		dispatch(deleteTodoList(index));
	}

	function todoListTitleTextAreaOnBlur(e) {
		const element = e.target;
		const newText = element.value;

		if (newText === "") {
			element.value = todoList.name;
			return;
		}
		dispatch(editTodoListName(index, newText));
	}

	const [, dropElement] = useDrop({
		accept: config.dnd.types.todoCard,
		hover(item, monitor) {
			if (item.listIndex === undefined || item.cardIndex === undefined || item.listIndex === index) return;

			dispatch(moveTodoCard({ listIndex: item.listIndex, cardIndex: item.cardIndex }, { listIndex: index, cardIndex: todoList.cards.length }));

			item.listIndex = index;
			item.cardIndex = todoList.cards.length;
		},
	});

	dropElement(todosBodyRef);

	return (
		<>
			<section className="todoList">
				<section className="heading">
					<TextareaAutosize ref={todosTitleRef} onKeyPress={blurInputOnNewLine} onBlur={todoListTitleTextAreaOnBlur} spellCheck="false" className="resetTextArea" />
					<div className="controls">
						<i className="fas fa-trash-alt deleteCard" onClick={deleteButtonOnClick}></i>
					</div>
				</section>

				<section className="body" ref={todosBodyRef}>
					{todoList.cards.map((todo, cardIndex) => {
						return <TodoItem key={cardIndex} listIndex={index} cardIndex={cardIndex} todo={todo} />;
					})}
				</section>

				<section className="addCard">
					<TextareaAutosize ref={addTodoTextAreaRef} className="resetTextArea" placeholder="Enter card name" spellCheck="false" onKeyPress={(e) => addOnEnter(e, addTodoButtonRef)} />
					<button ref={addTodoButtonRef} onClick={handleAddTodo}>
						Add
					</button>
				</section>
			</section>
		</>
	);
}
