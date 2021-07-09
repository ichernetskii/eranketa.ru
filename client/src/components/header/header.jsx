// React
import React from "react";

// CSS
import "./header.scss";

const Header = () => {
    return (
        <div className="header">
            <a href="/admin">Goto admin panel</a>
            <span>Test login: eranketa@eranketa.ru, password: eranketa</span>
        </div>
    );
};

export default Header;
