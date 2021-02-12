export function blurInputOnNewLine(e) {
	if (e.nativeEvent.keyCode === 13) {
		e.preventDefault();
		e.target.blur();
	}
}
export function addOnEnter(e, addButtonRef) {
	if (e.nativeEvent.keyCode === 13) {
		e.preventDefault();
		e.target.blur();
		addButtonRef.current.click();
	}
}
