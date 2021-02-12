import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeBackgroundImage, editSelectBgImgModal } from "../../store/ui";
import Modal from "react-modal";
import "./style.scss";

export default function SelectGbImgModal() {
	const dispatch = useDispatch();
	const modalInfo = useSelector((state) => state.ui.selectBgImgModal);

	const modalStyles = {
		overlay: {
			opacity: modalInfo.isOpen ? "" : "0",
			pointerEvents: modalInfo.isOpen ? "" : "none",
		},
	};

	function handleModalCloseRequest() {
		dispatch(editSelectBgImgModal({ isOpen: false }));
	}
	function bgImgSelected(e) {
		dispatch(changeBackgroundImage(e.target.src));
	}

	return (
		<Modal className={`selectBgImgModal ${modalInfo.isOpen ? "isOpen" : ""}`} overlayClassName="selectBgImgModalOverlay" style={modalStyles} isOpen={true} onRequestClose={handleModalCloseRequest} shouldCloseOnOverlayClick={true}>
			{Object.values(modalInfo.images).map((img, index) => {
				return (
					<figure key={index}>
						<img src={img.default} alt="" onClick={bgImgSelected} />
						<div>
							<img src={img.default} alt="" onClick={bgImgSelected} />
						</div>
					</figure>
				);
			})}
		</Modal>
	);
}
