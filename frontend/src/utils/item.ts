import { AxiosError, AxiosResponse } from "axios"
import type { AddItemProduct } from "../../../types/AddItem"
import { api } from "./api"
import { ScannedItem } from "@prisma/client"

export const createItem = (item: AddItemProduct | AddItemProduct[]): Promise<AxiosResponse | AxiosError> => {
    return new Promise((resolve, reject) => {
        api.post("/items/create", item)
        .then(res => {
            return resolve(res)
        })
        .catch(err => {
            return reject(err)
        })
    })
}

export const scanItem = (scanItem: ScannedItem) => {
    return api.post("/items/scan", scanItem)
}

export const deleteScan = (scanId: number) => {
    return api.delete(`/items/scan/${scanId}`)
}

export const deleteScanLine = (scanLineId: number) => {
    return api.delete(`/items/scan-line/${scanLineId}`)
}