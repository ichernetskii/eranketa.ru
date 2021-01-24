// React
import React, {Suspense} from "react";
import ReactDOM from "react-dom";

// Materialize
import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize.js";

// Components
const App = React.lazy(() => import("components/app"));

ReactDOM.render(
    <Suspense fallback="Загрузка ...">
        <App />
    </Suspense>,
    document.getElementById("root")
);
