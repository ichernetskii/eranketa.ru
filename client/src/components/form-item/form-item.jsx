// React
import React, {useState, useEffect, useMemo} from "react";

// Config
import { mapData } from "js/config.js";

// Libs
import Form from "@/model/Form.js";
import {errorMessage} from "js/assets/utils.js";

// Components
import InputGroup from "components/input-group";
import Header from "components/header";

// CSS
import "./form-item.scss";

const FormItem = () => {
    const [message, setMessage] = useState({
        className: "input-group__message",
        text: ""
    });
    const initialData = {
        email: "", name: "", phone: "", birthDate: "", additionalInfo: "", social: "", job: "", position: "", goal: ""
    };
    const [data, setData] = useState(initialData);
    const [stage, setStage] = useState({value: 1, message: "<div>Done</div><div>Done</div><div>Done</div><div>Done</div>"});
    const [pageErrors, setPageErrors] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [content, setContent] = useState("");

    useEffect(() => {
        const onChangeHandler = e => {
            setPageErrors(errors => errors.filter(err => err.param !== e.target.id));
            setData(d => ({ ...d, [e.target.id]: e.target.value }));
        };

        const onSubmitHandler = async () => {
            try {
                setLoading(true);
                const form = new Form(data);
                const response = await form.create();
                setPageErrors([]);
                // setMessage({ className: "input-group__message", text: response.message });
                setStage({value: 1, message: response.message});
            } catch (e) {
                if (Array.isArray(e.errors) && e.errors.length !== 0) {
                    setPageErrors([...e.errors]);
                    setMessage(m => ({...m, text: ""}))
                } else {
                    setMessage({
                        className: "input-group__message input-group__message_error",
                        text: e.message || errorMessage
                    });
                }
            } finally {
                setLoading(false);
            }
        }

        const onRefillHandler = e => {
            e.preventDefault();
            setStage({value: 0, message: null})
            setData(initialData);
        }

        switch (stage.value) {
            case  1: setContent(
                <div className="form-item result">
                    <div className="card blue-grey darken-1 result-card">
                        <div className="card-content black-text">
                            <p className="result-card__title">{stage.message}</p>
                        </div>
                        <div className="card-action red-text">
                            <a className="result-card__link" href="#" onClickCapture={onRefillHandler}>Заполнить еще раз</a>
                        </div>
                    </div>
                </div>
            );
                     break;
            case  0:
            default: setContent(
                <>
                    <h1 className="header-1 page__header">Анкета для сторонников партии</h1>
                    <div className="form-item">
                        {
                            Object.entries(mapData).map(([key, value]) => (
                                <InputGroup
                                    key={key}
                                    onChange={onChangeHandler}
                                    id={key}
                                    label={value.label}
                                    defaultValue={data[key]}
                                    pageErrors={pageErrors.filter(err => err.param === key)}
                                    type={value.type}
                                    required={value.required}
                                />
                            ))
                        }
                        <div className="input-group">
                            <button disabled={isLoading} className="waves-effect waves-light btn input-group__button" onClick={onSubmitHandler}>Отправить</button>
                            <div className={message.className}>{message.text}</div>
                        </div>
                    </div>
                </>
            );
        }
    }, [mapData, pageErrors, data, stage, isLoading]);

    return (
        <div className="page form-page">
            <Header />
            {
                content
            }
        </div>
    );
};

export default FormItem;
