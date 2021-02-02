import {buildQueryString, request} from "../js/assets/utils.js";

const getAuthHeader = token => ({ Authorization: `Bearer ${token}` });

export default class Form {
    #form = null;

    constructor(form) {
        this.#form = {...form};
    }

    async create() {
        return await request("/api/form/create", "POST", this.#form);
    }

    async update(token) {
        return await request("/api/form", "PUT", this.#form, getAuthHeader(token));
    }

    async delete(token) {
        return await request("/api/form", "DELETE", this.#form, getAuthHeader(token));
    }

    async getAll(token, options = {
        skip: null,
        limit: 5,
        sort: null
    }) {
        const query = buildQueryString(options);
        const {forms} = await request("/api/form" + query, "GET", null, getAuthHeader(token));
        return forms;
    }

    async getCount(token) {
        const {count} = await request("/api/form/count", "GET", null, getAuthHeader(token));
        return count;
    }
}
