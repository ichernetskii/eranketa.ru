// React
import React, {useState, useEffect, useCallback, useMemo, useRef} from "react";
import { debounce } from "debounce";
import { mapData } from "js/config.js";

// Store
import {useStore} from "components/store";

// Hooks
import {useHTTP} from "@/hooks/useHTTP.js";

// Components
import InputGroup from "components/input-group";
import Loader from "components/loader";

// CSS
import "./form-list.scss";

const FormList = () => {
    // State
    const { state, dispatch } = useStore();
    const { userData } = state;
    const { token, rights } = userData;
    const authorizationHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
    rights.forEach(item => rights[item] = true);
    const [listOptions, setListOptions] = useState({
        skip: null,
        limit: 5,
        sort: null
    });
    const [currentFormId, setCurrentFormId] = useState(null);
    const [pageErrors, setPageErrors] = useState([]);
    const [changes, setChanges] = useState(0);
    const [table, setTable] = useState(null);
    const [pager, setPager] = useState(null);

    // Refs
    const $collapsible = useRef(null);

    const incChanges = () => setChanges(c => c + 1);
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
    const getCurrentPage = () => Math.floor(1 + listOptions.skip / listOptions.limit);

    const { request } = useHTTP();

    useEffect(() => {
        M.Collapsible.init($collapsible.current, {});
        setTable(<div className="loader"><Loader /></div>);
    }, [setTable, Loader]);

    // useEffect(() => {
    //     M.updateTextFields();
    // }, [table])

    try {
        const getTable = useCallback(async () => {
            try {
                const onChangeHandler = debounce(async e => {
                    try {
                        setCurrentFormId(e.target.id);
                        setPageErrors([]);
                        const response = await request("/api/form", "PUT", {
                            id: e.target.dataset.id,
                            [e.target.dataset.field]: e.target.value
                        }, authorizationHeader);

                        M.toast({html: response.message});

                        incChanges();
                    } catch (e) {
                        if (e.errors) {
                            setPageErrors(e.errors);
                        } else
                            if (e.message) M.toast({html: e.message});
                            else throw e
                    }
                }, 2000);

                const onDeleteHandler = async e => {
                    e.stopPropagation();

                    try {
                        const response = await request("/api/form", "DELETE", {
                            id: e.target.dataset.id ?? e.target.parentElement.dataset.id
                        }, authorizationHeader);

                        M.toast({html: response.message});

                        incChanges();
                    } catch (e) {
                        if (e.errors) e.errors.forEach(e => M.toast({html: e.msg}));
                        else
                            if (e.message) M.toast({html: e.message});
                            else throw e
                    }
                }

                let query = Object
                    .entries(listOptions)
                    .map(([key, value]) => value ? `${key}=${value}` : "")
                    .filter(queryItem => queryItem !== "")
                    .join("&");
                if (query !== "") query = "?" + query;

                const {forms} = await request("/api/form" + query, "GET", null, authorizationHeader);
                setTable(
                    forms.map(form => (
                        <li key={form["_id"]} className="item">
                            <div className="collapsible-header item__header">
                                {form.name} - {form.email}
                                { rights.canEdit && <a data-id={`${form["_id"]}`}
                                   className="waves-effect waves-light btn item__delete"
                                   onClickCapture={onDeleteHandler} >
                                    <i className="material-icons">delete</i>
                                </a>}
                            </div>
                            {Object
                                .entries(mapData)
                                .map(([key, value]) => (
                                    <div className="collapsible-body item__body" key={form["_id"] + key}>
                                        <InputGroup
                                            onChange={onChangeHandler}
                                            id={key + "_" + form["_id"]}
                                            label={value.label}
                                            pageErrors={
                                                (currentFormId === key + "_" + form["_id"]) && pageErrors
                                            }
                                            labelClasses="form-label"
                                            type={value.type}
                                            dataId={form["_id"]}
                                            dataField={key}
                                            defaultValue={form[key]}
                                            onBlur={incChanges}
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
        }, [ token, listOptions, changes, pageErrors ]);

        const getPager = useCallback(async () => {
            const {count} = await request("/api/form/count", "GET", null, authorizationHeader);
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
        }, [ token, listOptions ]);

        useEffect(() => {
            getTable();
            getPager();
        }, [getTable, getPager]);
    } catch (e) {
        M.toast({ html: e.message });
    }

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
