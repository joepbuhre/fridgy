import { isDate } from '@vue/shared'
import moment from 'moment'
import type { Product } from "../../../types/FoodProduct";

export const prettydelta = (date: Date | string) => {
    const now = moment()

    if(!isDate(date)) {
        date = new Date(date)
    }

    const diff = moment(date).diff(now, 'days')
    
    if(diff > 1) {
        return `${diff} days`
    } else {
        return `${diff} day`
    }

}

export const getProductName = (product: Product | undefined): string => {

    if(product === undefined) {return 'onbekend'}
    else if(product.product_name_nl) {return product.product_name_nl}
    else if(product.product_name_en) {return product.product_name_en}
    else if(product.product_name) {return product.product_name}
    else {return 'onbekend'}
}