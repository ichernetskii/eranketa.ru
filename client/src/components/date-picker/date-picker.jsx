// React
import React, {useEffect, useRef} from "react";

// Lib
import {dateToString, getOS, stringToDate} from "js/assets/utils.js";

// Assets
import i18n_ru from "./i18n.ru.json";

// CSS
import "./date-picker.scss";

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

    useEffect(() => {
        const onSelectHandler = newDate => {
            if (onSelect) {
                const e = {
                    target: {
                        value: stringToDate(newDate),
                        //value: newDate,
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
            yearRange: [thisYear - 100, thisYear],
            changeYear: true,
            firstDay: 0,
            autoClose: true,
            defaultDate: dateToString(stringToDate(defaultDate)),
            parse: stringToDate,
            setDefaultDate: !!defaultDate,
            onSelect: onSelectHandler,
            onDraw: () => {
                if (["MacOS", "iOS"].includes(getOS())) {
                    document
                        .querySelectorAll(".select-dropdown")
                        .forEach($item => $item.classList.add("displayNone"))
                    document
                        .querySelectorAll(".datepicker-select")
                        .forEach($item => $item.classList.add("browser-default"))
                }
            },
            i18n: i18n_ru
        });
    }, [onSelect, id, dataId, dataField, defaultDate]);

    return (
            <input
                type="text"
                id={id}
                data-id={dataId}
                data-field={dataField}
                className={`${className} datepicker`}
                readOnly={readOnly}
                ref={$datePicker}
                defaultValue={dateToString(stringToDate(defaultDate))}
            />
    );
};

export default DatePicker;
