import { isDate } from '@vue/shared'
import moment from 'moment'

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