import { useRef, useEffect } from "react";
import config from "../../config/all";
import { useSelector, useDispatch } from "react-redux";
import { editTodoCard } from "../../store/todoLists";
import { editTodoCardModal } from "../../store/ui";
import { blurInputOnNewLine } from "../../include/functions";
import momont from "moment";
import Modal from "react-modal";
import TextareaAutosize from "react-textarea-autosize";
import "./style.scss";

Modal.setAppElement(document.getElementById(config.app.rootElementId));

export default function TodoItemModal() {
	const dispatch = useDispatch();
	const todoCardModalInfo = useSelector((state) => state.ui.todoCardModal);
	const todoList = useSelector((state) => state.entities.todoLists.list[todoCardModalInfo.todoListIndex]);
	const todoCard = todoList?.cards[todoCardModalInfo.todoCardIndex];

	const modalStyles = {
		content: {
			display: todoCardModalInfo.isOpen ? "" : "none",
		},
		overlay: {
			display: todoCardModalInfo.isOpen ? "" : "none",
		},
	};

	const todoCardModalTextAreaRef = useRef();

	useEffect(() => {
		if (todoCardModalTextAreaRef.current) todoCardModalTextAreaRef.current.value = todoCard?.name;
	}, [todoCard?.name, todoCardModalInfo.todoListIndex, todoCardModalInfo.todoCardIndex]);

	function handleTodoCardModalClose() {
		dispatch(
			editTodoCardModal({
				isOpen: false,
			})
		);
	}

	function todoCardModalTextAreaOnBlur(e) {
		const element = e.target;
		const newText = element.value;

		if (newText === "") {
			element.value = todoCard.name;
			return;
		}
		dispatch(editTodoCard(todoCardModalInfo.todoListIndex, todoCardModalInfo.todoCardIndex, { name: newText, modifiedAt: Date.now() }));
	}

	return (
		<>
			<Modal className="TodoItemModal" overlayClassName="TodoItemModalOverlay" style={modalStyles} isOpen={true} onRequestClose={handleTodoCardModalClose} shouldCloseOnOverlayClick={true}>
				<i className="far fa-times closeModal" onClick={handleTodoCardModalClose}></i>
				<header>
					<TextareaAutosize ref={todoCardModalTextAreaRef} spellCheck="false" className="resetTextArea todoNameTextArea" onKeyPress={blurInputOnNewLine} onBlur={todoCardModalTextAreaOnBlur} />
				</header>
				<div className="info">
					<div className="time">
						<i className="far fa-clock"></i>
						<br />
						<span>
							Created At: {momont(todoCard?.createdAt).format("YYYY/MM/DD HH:mm:ss")}
							<br />
							Modified At: {momont(todoCard?.modifiedAt).format("YYYY/MM/DD HH:mm:ss")}
						</span>
					</div>
				</div>
			</Modal>
		</>
	);
}
