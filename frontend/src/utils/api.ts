import axios from "axios";
import { getAuthRedirect } from "./helpers";

const api = axios.create({
    baseURL: "/api",
});

export const wff = axios.create({
    baseURL: "https://world.openfoodfacts.org/api/v2",
});

api.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        if (import.meta.env.DEV) {
            return err;
        } else {
            window.location.href = getAuthRedirect();
        }
    }
);

export { api };
