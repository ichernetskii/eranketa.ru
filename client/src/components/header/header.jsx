// React
import React from "react";

// CSS
import "./header.scss";

const Header = () => {
    return (
        <div className="header">
            <a href="/admin">Admin panel</a>
            <span>Test login: ilia@google.com<br/>Password: 111111</span>
        </div>
    );
};

export default Header;
