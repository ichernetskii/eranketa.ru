// React
import React from "react";

// CSS
import "./header.scss";

const Header = () => {
    return (
        <div className="header">
            <a href="/admin">Admin panel</a>
            <span>Test login: eranketa@eranketa.ru<br/>Password: eranketa</span>
        </div>
    );
};

export default Header;
