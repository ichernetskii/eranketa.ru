// React
import React, {useState, useEffect, useRef} from "react";

// Store
import {useStore} from "components/store";

// Model
import Form from "@/model/Form.js";

// Libs
import { debounce } from "debounce";

// Components
import InputGroup from "components/input-group";
import Loader from "components/loader";

// Config
import { mapData } from "js/config.js";

// CSS
import "./form-list.scss";

const FormList = () => {
    // State
    const { state, dispatch } = useStore();
    const { userData } = state;
    const { token, rights } = userData;
    rights.forEach(item => rights[item] = true);
    const [listOptions, setListOptions] = useState({
        skip: null,
        limit: 5,
        sort: null
    });
    const [pageErrors, setPageErrors] = useState({
        errors: [],
        controlId: null
    });
    const [table, setTable] = useState(null);
    const [pager, setPager] = useState(null);

    // Refs
    const $collapsible = useRef(null);

    useEffect(() => {
        M.Collapsible.init($collapsible.current, {});
        setTable(<div className="loader"><Loader /></div>);
    }, [setTable, Loader]);

    // useEffect(() => {
    //     M.updateTextFields();
    // }, [table])

    // Table
    useEffect(async () => {
        try {
            const onChangeHandler = async e => {
                try {
                    const form = new Form({
                        id: e.target.dataset.id,
                        [e.target.dataset.field]: e.target.value
                    });
                    const response = await form.update(token);

                    setPageErrors({});
                    M.toast({html: response.message});
                } catch (err) {
                    if (err.errors) setPageErrors({
                        errors: err.errors,
                        controlId: e.target.id
                    });
                    else
                        if (err.message) M.toast({html: err.message});
                        else throw err
                }
            };

            const onDeleteHandler = async e => {
                try {
                    e.stopPropagation();

                    const form = new Form({
                        id: e.target.dataset.id ?? e.target.parentElement.dataset.id
                    });
                    const response = await form.delete(token);

                    setPageErrors({});
                    M.toast({html: response.message});
                } catch (err) {
                    if (err.errors) setPageErrors({
                        errors: err.errors,
                        controlId: e.target?.id
                    });
                    else
                        if (err.message) M.toast({html: err.message});
                        else throw err
                }
            }

            const form = new Form();
            const forms = await form.getAll(token, listOptions);

            setTable(
                forms.map(form => (
                    <li key={form["_id"]} className="item">
                        <div className="collapsible-header item__header">
                            {form.name} - {form.email}
                            { rights.canEdit &&
                                <a data-id={`${form["_id"]}`}
                                   className="waves-effect waves-light btn item__delete"
                                   onClickCapture={onDeleteHandler}>
                                    <i className="material-icons">delete</i>
                                </a>}
                        </div>
                        {Object
                            .entries(mapData)
                            .map(([key, value]) => (
                                <div className="collapsible-body item__body" key={form["_id"] + key}>
                                    <InputGroup
                                        onChange={debounce(onChangeHandler, 2000)}
                                        id={key + "_" + form["_id"]}
                                        label={value.label}
                                        pageErrors={ (pageErrors.controlId === key + "_" + form["_id"]) && pageErrors.errors }
                                        type={value.type}
                                        dataId={form["_id"]}
                                        dataField={key}
                                        defaultValue={form[key]}
                                        readOnly={!rights.canEdit}
                                    />
                                </div>
                            ))}
                    </li>
                ))
            );
        } catch (e) {
            M.toast({ html: e.message });
            setTable(<div className="loader">{e.message}</div>);
        }
    }, [listOptions, token, rights, mapData, pageErrors]);

    // Pager
    useEffect(async () => {
        try {
            const form = new Form();
            const count = await form.getCount(token);

            const getCurrentPage = () => Math.floor(1 + listOptions.skip / listOptions.limit);
            const toPage = (n, count) => {
                if (n < 1) return;
                const maxPage = Math.ceil(count/listOptions.limit);
                if (n > maxPage) return;
                setTable(<div className="loader"><Loader /></div>);
                setListOptions(options => ({
                    ...options,
                    skip: (n - 1) * options.limit
                }));
            }
            const generatePages = () => {
                const maxPage = Math.ceil(count/listOptions.limit);
                return Array(maxPage)
                    .fill(0)
                    .map((_, i) => i + 1)
                    .map(page => (
                        <div key={page} className="pager__item" onClick={
                            () => {
                                page !== getCurrentPage() ? toPage(page) : null
                            }
                        }>
                            {page}
                        </div>
                    ))
            }

            setPager(
                <div className="pager">
                    <div className="pager__item" onClick={() => toPage(getCurrentPage() - 1, count)}>❮</div>
                    { generatePages() }
                    <div className="pager__item" onClick={() => toPage(getCurrentPage() + 1, count)}>❯</div>
                </div>
            );
        } catch (e) {
            M.toast({ html: e.message });
            setPager(null);
        }
    }, [listOptions, token, Loader, pageErrors]);


    return (
        <div className="form-list">
            <ul className="collapsible form-list__data" ref={$collapsible}>
                { table }
            </ul>
            { pager }
        </div>
    );
}

export default FormList;
