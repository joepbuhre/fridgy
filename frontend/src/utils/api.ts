import axios from "axios";

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
        alert("Je bent mogelijk niet meer ingelogd. Controleer dit");
    }
);

export { api };
