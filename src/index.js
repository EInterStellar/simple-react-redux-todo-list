import { Provider as ReduxProvider } from "react-redux";
import config from "./config/all";
import store from "./store/configureStore";
import React from "react";
import ReactDOM from "react-dom";
import log from "loglevel";
import App from "./App";

// ======= Log System ========= //
if (config.logging.isOn) log.enableAll();
else log.disableAll();

ReactDOM.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<App />
		</ReduxProvider>
	</React.StrictMode>,
	document.getElementById(config.app.rootElementId)
);
