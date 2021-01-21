// React
import React, {Suspense} from "react";

// CSS
import "./app.scss";

// Store
import {withStore} from "components/store";

// Components
const Page = React.lazy(() => import("components/page"));

const App = () => {
    return (
            <div className="app">
                <Suspense fallback="Загрузка ...">
                    <Page />
                </Suspense>
            </div>
    );
};

export default withStore(App);
