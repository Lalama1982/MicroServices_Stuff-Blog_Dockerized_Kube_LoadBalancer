import React from "react";
import ReactDom from "react-dom";

import App from "./App";

// Here "root" refers to the "div" element of "root" at "client/public/index.html" ["index.html" is created by default]
ReactDom.render(<App />, document.getElementById("root"));
