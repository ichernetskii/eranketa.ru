// React
import React from "react";

// CSS
import "./page.scss";

// Store
import {useStore} from "components/store";

const Page = () => {
    const { state, dispatch } = useStore();
    const { defaultProperty } = state;

    return (
        <div className="page">
            <img className={"img"} src={require("./img/react.png")} alt={"react"} style={{ width: 200 }} />
            <div>
                Default property: { defaultProperty }
            </div>
        </div>
    );
};

export default Page;
