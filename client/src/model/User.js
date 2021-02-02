import {request} from "../js/assets/utils.js";

export default class User {
    #user = null;

    constructor(user) {
        this.#user = {...user};
    }

    async register() {
        return await request("/api/auth/register", "POST", this.#user);
    }

    async login() {
        return await request("/api/auth/login", "POST", this.#user);
    }
}
