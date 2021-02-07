// React
import React, {useState, useEffect, useCallback} from "react";

import NumberFormat from "react-number-format";

// CSS
import "./input-group.scss";
import DatePicker from "components/date-picker";

const InputGroup = ({
                        onChange = null,
                        id = null,              // for bind with label
                        label = null,
                        maxLength = 200,
                        pageErrors = [],
                        type = "text",
                        required = false,
                        onKeyDown = null,
                        dataId = null,
                        dataField = null,
                        defaultValue = null,
                        onBlur = null,
                        readOnly = null
                    }) => {
    const [social, setSocial] = useState(defaultValue ?? "https://vk.com/");
    const [activeLabel, setActiveLabel] = useState(["tel", "url"].includes(type));
    const [cancelError, setCancelError] = useState(false);
    let status = "";
    let messages = "";
    if (pageErrors?.length && !cancelError) {
        status = "invalid";
        messages = pageErrors.map(e => e.msg).join("; ");
    }

    const onSelectHandler = useCallback((e) => {
        setCancelError(true);
        setActiveLabel(true);
        onChange(e);
    }, [onChange]);

    useEffect(() => {
        setCancelError(false);
        if (defaultValue) {
            setActiveLabel(true);
        }
    }, [pageErrors])

    return (
        <div className="input-field col s6 input-group">
            {
                (["text", "password", "email"].includes(type)) &&
                    <input
                        id={id}
                        type={type}
                        inputMode={type}
                        className={`${status}`}
                        onChange={e => {
                            setCancelError(true);
                            onChange(e);
                        }}
                        onKeyDown={onKeyDown}
                        maxLength={maxLength}
                        data-id={dataId}
                        data-field={dataField}
                        defaultValue={defaultValue}
                        onBlur={onBlur}
                        readOnly={readOnly}
                    />
            }

            {
                type === "tel" &&
                <NumberFormat
                    format="+7 (###) ###-##-##"
                    allowEmptyFormatting
                    mask="_"
                    inputMode={type}

                    id={id}
                    type={type}
                    className={`${status}`}
                    onChange={e => {
                        setCancelError(true);
                        onChange(e);
                    }}
                    onKeyDown={onKeyDown}
                    maxLength={maxLength}
                    data-id={dataId}
                    data-field={dataField}
                    defaultValue={defaultValue}
                    onBlur={onBlur}
                    readOnly={readOnly}
                />
            }

            {
                type === "url" &&
                <input
                    inputMode={type}

                    id={id}
                    type={type}
                    className={`${status}`}
                    onChange={e => {
                        if (e.target.value.match(/^https:\/\/vk\.com\/([a-zA-Z\d])*$/))
                            setSocial(e.target.value);
                        setCancelError(true);
                        onChange(e);
                    }}
                    value={social}
                    maxLength={maxLength}
                    data-id={dataId}
                    data-field={dataField}
                    onBlur={onBlur}
                    readOnly={readOnly}
                />
            }

            {
                type === "textarea" &&
                <textarea
                    id={id}
                    className={`materialize-textarea ${status}`}
                    onChange={e => {
                        setCancelError(true);
                        onChange(e);
                    }}
                    maxLength={maxLength}
                    data-id={dataId}
                    data-field={dataField}
                    defaultValue={defaultValue}
                    onBlur={onBlur}
                    readOnly={readOnly}
                />
            }

            {
                type === "date" &&
                <DatePicker
                    id={id}
                    dataId={dataId}
                    className={`${status}`}
                    dataField={dataField}
                    defaultDate={defaultValue}
                    readOnly={readOnly}
                    onSelect={onSelectHandler}
                />
            }

            <label
                htmlFor={id}
                className={`input-group__label` + (required ? " required" : "") + (activeLabel ? " active" : "")}
            >
                {label}
            </label>
            <span className="helper-text" data-error={messages} data-success="" />
        </div>
    );
};

export default InputGroup;
