import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import Pokedex from "./Pokedex.js";
//import "bootstrap/dist/js/bootstrap";
//import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Pokedex />
);

/* in React 18 when you run in dev mode with React.StrictMode on. Your useEffect hook will always run atleast twice because your component is mounted twice.
<React.StrictMode>
</React.StrictMode>
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
