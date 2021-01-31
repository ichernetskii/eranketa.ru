// React
import React, {useState, useLayoutEffect, useEffect, useCallback, useMemo, useRef} from "react";

// CSS
import "./date-picker.scss";
import {dateToString, stringToDate} from "js/assets/utils.js";

const DatePicker = ({
    id,                         // id of React-element
    defaultDate = null,
    onSelect = null,
    dataId,                     // id of form
    dataField,                  // name of field id DB
    className,
    readOnly = false
                    }) => {
    const $datePicker = useRef(null);

    useLayoutEffect(() => {
        const onSelectHandler = newDate => {
            if (onSelect) {
                const e = {
                    target: {
                        value: newDate,
                        id,
                        dataset: { id: dataId, field: dataField }
                    }
                };
                onSelect(e);
            }
        };

        const thisYear = new Date().getFullYear();
        M.Datepicker.init($datePicker.current, {
            format: "dd.mm.yyyy",
            yearRange: [thisYear - 120, thisYear],
            autoClose: true,
            defaultDate: stringToDate(defaultDate),
            setDefaultDate: true,
            onSelect: onSelectHandler
        });
    }, [onSelect, id, dataId, dataField]);

    return (
            <input
                type="text"
                id={id}
                data-id={dataId}
                data-field={dataField}
                className={`${className} datepicker`}
                readOnly={readOnly}
                ref={$datePicker}
                defaultValue={stringToDate(defaultDate)}
            />
    );
};

export default DatePicker;
