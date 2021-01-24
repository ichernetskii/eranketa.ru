// React
import React, {useState, useRef} from "react";

// CSS
import "./input-group.scss";

const InputGroup = ({
                        onInput,
                        id,
                        label,
                        maxLength = 100,
                        pageErrors = [],
                        type = "input",
                        required = true,
                        labelClasses = "",
                        value = "",
                        loginFn
                    }) => {
    return (
        <div className="input-group">
            <label className={"input-group__label" + (required ? " required" : "") + (labelClasses ? ` ${labelClasses}` : "") } htmlFor={id}>{label}</label>
            <div className="input-group__group">
                { type === "input"    && <input    onChange={onInput} className="input-group__input"    id={id} maxLength={maxLength} value={value} /> }
                { type === "password" && <input    onChange={onInput} onKeyDown={e => { if (e.code === "Enter" && loginFn) loginFn() }} className="input-group__input"    id={id} maxLength={maxLength} value={value} type="password" /> }
                { type === "textarea" && <textarea onChange={onInput} className="input-group__textarea" id={id} maxLength={maxLength}>{value}</textarea> }
                <div className="input-group__error">
                    { pageErrors
                        .filter(err => err.param === id)
                        .map(err => <div className="input-group__error-item" key={err.msg}>{err.msg}</div>) }
                </div>
            </div>
        </div>
    );
};

export default InputGroup;
