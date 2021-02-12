import React, { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteTodoCard, editTodoCard, moveTodoCard } from "../../../../store/todoLists";
import { editTodoCardModal } from "../../../../store/ui";
import { blurInputOnNewLine } from "../../../../include/functions";
import config from "../../../../config/all";
import TextareaAutosize from "react-textarea-autosize";
import { useDrag, useDrop } from "react-dnd";
import "./../../../../assets/scss/font-awesome/fontawesome.scss";
import "./style.scss";

export default function TodoItem({ todo, listIndex, cardIndex }) {
	const dispatch = useDispatch();

	const todoCardElementRef = useRef();
	const todoCardTextAreaRef = useRef();
	const todoCardControlRef = useRef();

	useEffect(() => {
		todoCardTextAreaRef.current.value = todo.name;
	}, [todo.name]);

	function cardTextAreaOnBlur(e) {
		const element = e.target;
		const newText = element.value;

		if (newText === "") {
			element.value = todo.name;
			return;
		}
		dispatch(editTodoCard(listIndex, cardIndex, { name: newText, modifiedAt: Date.now() }));
	}

	function deleteButtonOnClick() {
		dispatch(deleteTodoCard(listIndex, cardIndex));
	}

	function focusTextArea(e) {
		todoCardTextAreaRef.current.focus();
		e.preventDefault();
	}

	const [, dropElement] = useDrop({
		accept: config.dnd.types.todoCard,
		hover(item, monitor) {
			if (item.cardIndex === cardIndex && item.listIndex === listIndex) return;

			const hoveredRect = todoCardElementRef.current.getBoundingClientRect();
			const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
			const mousePosition = monitor.getClientOffset();
			const hoverClientY = mousePosition.y - hoveredRect.top;

			const dropIndex = hoverClientY > hoverMiddleY ? cardIndex + 1 : hoverClientY < hoverMiddleY ? cardIndex : 0;

			if (item.cardIndex === dropIndex) return;

			dispatch(moveTodoCard({ listIndex: item.listIndex, cardIndex: item.cardIndex }, { listIndex: listIndex, cardIndex: dropIndex }));

			item.listIndex = listIndex;
			item.cardIndex = dropIndex;
		},
	});

	const [, dragElement] = useDrag({
		item: {
			type: config.dnd.types.todoCard,
			listIndex: listIndex,
			cardIndex: cardIndex,
		},
		begin(monitor) {
			setTimeout(() => {
				dispatch(editTodoCard(listIndex, cardIndex, { isDragging: true }));
			}, 0);
		},
		end(item, monitor) {
			dispatch(editTodoCard(item.listIndex, item.cardIndex, { isDragging: false }));
		},
	});

	dropElement(dragElement(todoCardElementRef));

	function handleOpenTodoCardModal(e) {
		if (e.target !== todoCardControlRef.current) return;
		dispatch(
			editTodoCardModal({
				isOpen: true,
				todoListIndex: listIndex,
				todoCardIndex: cardIndex,
			})
		);
	}

	return (
		<>
			<section ref={todoCardElementRef} className="todoItem" style={{ opacity: todo.isDragging ? 0 : 1 }} onContextMenu={focusTextArea}>
				<TextareaAutosize ref={todoCardTextAreaRef} spellCheck="false" className="resetTextArea" onKeyPress={blurInputOnNewLine} onBlur={cardTextAreaOnBlur} />
				<div ref={todoCardControlRef} className="controls" onClick={handleOpenTodoCardModal}>
					<i className="far fa-trash-alt deleteCard" onClick={deleteButtonOnClick}></i>
				</div>
			</section>
		</>
	);
}
