// React
import React, {Suspense} from "react";
import ReactDOM from "react-dom";

// Components
const App = React.lazy(() => import("components/app"));

ReactDOM.render(
    <Suspense fallback="Загрузка ...">
        <App />
    </Suspense>,
    document.getElementById("root")
);
