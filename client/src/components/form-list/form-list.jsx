// React
import React, {useState, useEffect, useCallback} from "react";
import { debounce } from "debounce";

// Store
import {useStore} from "components/store";

// Hooks
import {useHTTP} from "@/hooks/useHTTP.js";

// CSS
import "./form-list.scss";

const FormList = () => {
    const { state, dispatch } = useStore();
    const { userData } = state;
    const { token, rights } = userData;
    rights.forEach(item => rights[item] = true);

    const [listOptions, setListOptions] = useState({
        skip: null,
        limit: 5,
        sort: null
    });
    const [changes, setChanges] = useState(0);
    const incChanges = () => setChanges(c => c + 1);
    const toPage = (n, count) => {
        if (n < 1) return;
        const maxPage = Math.ceil(count/listOptions.limit);
        if (n > maxPage) return;
        setListOptions(options => ({
            ...options,
            skip: (n - 1) * options.limit
        }));
    }
    const getCurrentPage = () => Math.floor(1 + listOptions.skip / listOptions.limit);

    const mapData = {
        email: "Email",
        name: "Фамилия, имя, отчество",
        phone: "Телефон",
        additionalInfo: "Дополнительная информация"
    }

    const { request } = useHTTP();
    const [table, setTable] = useState(null);
    const [pager, setPager] = useState(null);

    useEffect(() => {
        const elems = document.querySelectorAll('.collapsible');
        const instances = M.Collapsible.init(elems, {});
        setTable(<div className="loader">Загрузка</div>);
    }, []);

    try {
        const getTable = useCallback(async () => {
            try {
                const onChangeHandler = debounce(async e => {
                    try {
                        const response = await request("/api/form", "PUT", {
                            id: e.target.dataset.id,
                            [e.target.dataset.field]: e.target.value
                        }, {Authorization: `Bearer ${token}`});

                        M.toast({html: response.message});

                        incChanges();
                    } catch (e) {
                        e.errors.forEach(e => M.toast({html: e.msg}));
                    }
                }, 3000);

                let query = Object
                    .entries(listOptions)
                    .map(([key, value]) => value ? `${key}=${value}` : "")
                    .filter(queryItem => queryItem !== "")
                    .join("&");
                if (query !== "") query = "?" + query;

                const {forms} = await request("/api/form" + query, "GET", null, {Authorization: `Bearer ${token}`});
                setTable(
                    forms.map(form => (
                        <li key={form["_id"]}>
                            <div className="collapsible-header">{form.name}</div>
                            {Object
                                .entries(mapData)
                                .map(([key, value]) => (
                                    <div className="collapsible-body" key={form["_id"] + key}>
                                        <span>{value}</span>
                                        <input defaultValue={form[key]} data-id={form["_id"]} data-field={key}
                                               readOnly={!rights.canEdit} onChange={onChangeHandler}
                                               onBlur={incChanges}/>
                                    </div>
                                ))}
                        </li>
                    ))
                );
            } catch (e) {
                M.toast({ html: e.message });
                setTable(<div className="loader">{e.message}</div>);
            }
        }, [token, listOptions, changes]);

        const getPager = useCallback(async () => {
            const {count} = await request("/api/form/count", "GET", null, { Authorization: `Bearer ${token}` });
            const generatePages = () => {
                const maxPage = Math.ceil(count/listOptions.limit);
                return Array(maxPage)
                    .fill(0)
                    .map((_, i) => i + 1)
                    .map(page => (
                        <div key={page} className="pager__item" onClick={
                            () => {
                                setTable(<div className="loader">Загрузка</div>);
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
            <ul className="collapsible form-list__data">
                { table }
            </ul>
            { pager }
        </div>
    );
}

export default FormList;
