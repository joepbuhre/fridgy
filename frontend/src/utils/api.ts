import axios from "axios";

export const api = axios.create({
    baseURL: '/api'
})

export const wff = axios.create({
    baseURL: 'https://world.openfoodfacts.org/api/v2'
})