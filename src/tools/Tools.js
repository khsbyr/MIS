import { message, Tag } from "antd";
import { MSG, ORG_STEP, ORG_WISH } from "../constants/Constant";
import { Warning } from '../components/Confirm';

export const convertLazyParamsToObj = (lazyParams, searchParam = null) => {
    let obj = { search: searchParam || '' }
    if (lazyParams.sortField)
        obj.sort = lazyParams.sortField + ',' + (lazyParams.sortOrder > 0 ? 'asc' : 'desc')
    if (lazyParams.page)
        obj.page = lazyParams.page
    if (lazyParams.filters) {
        Object.entries(lazyParams.filters).forEach(([key, value]) => {
            if (obj.search !== '')
                obj.search += ' AND '
            if (value.matchMode === 'in') {
                obj.search += '('
                value.value.forEach(element => obj.search += `${obj.search.endsWith('(') ? '' : ' OR '}${key}:${element}`)
                obj.search += ')'
            }
            else
                obj.search += `${key}:${value.matchMode === 'contains' ? '*' : ''}${value.value}*`
        });
    }
    return obj
}

export const errorCatch = (error) => {
    if (!error) {
        message.error('Алдаа!!!')
        return
    }
    if (error.response && error.response.data && typeof error.response.data === 'object') {
        message.warning(error.response.data.error + '\t' + error.response.status + '\n' + error.response.data.path)
    } else if (error.request) {
        let msg = error.request.statusText + '-' + error.request.status + '; '
        if (error.response && error.response.config) {
            const urls = error.response.config.url?.split('?')
            msg += urls[0]
        }
        if (error.request.statusText === "Forbidden" && error.request.status === 403) {
            console.log(MSG.NOT_AUTHORIZED + ' ===>> ' + msg)
            Warning()
            return
        }
        if (error.request.statusText === "Unauthorized" && error.request.status === 401) {
            window.location.href = '/'
            return
        }
        message.warning(msg)
    } else {
        console.log('Error', error.message);
        message.warning(error.message)
    }
}

export const requireFieldFocus = () => {
    message.warning("Заавал бөглөх талбаруудыг бөглөнө үү");
    let el = document.querySelector(`.ant-form-item-has-error .ant-input,
    .ant-form-item-has-error .ant-select-selection-search-input,
    .ant-form-item-has-error .ant-input-number-input`);
    if (el) el.focus();
}

export const convertOrgStep = (step) => {
    switch (step) {
        case ORG_STEP.ACTIVE:
            return <Tag color="green">Илгээсэн</Tag>
        case ORG_STEP.APPROVED:
            return <Tag color="yellow">Зөвшөөрсөн</Tag>
        case ORG_STEP.REJECTED:
            return <Tag color="red">Татгалзсан</Tag>
        case ORG_STEP.EXPIRED:
            return <Tag color="yellow">Хугацаа хэтэрсэн</Tag>
        default:
            return step;
    }
}
export const convertOrgWish = (wish) => {
    switch (wish) {
        case ORG_WISH.CREATE:
            return "Байгууллага шинээр бүртгүүлэх хүсэлт"
        case ORG_WISH.CHANGE_INFO:
            return "Мэдээлэлд өөрчлөлт оруулах хүсэлт"
        case ORG_WISH.ESTABLISH:
            return "Өөрчлөн байгуулах хүсэлт"
        case ORG_WISH.REQUEST_FOR_END:
            return "Дуусгавар болгох хүсэлт"
        default:
            return wish;
    }
}

export const convertWish = (selectedWishStr) => {
    switch (selectedWishStr) {
        case "create":
            return ORG_WISH.CREATE
        case "update":
            return ORG_WISH.CHANGE_INFO
        case "change":
            return ORG_WISH.ESTABLISH
        case "inactive":
            return ORG_WISH.REQUEST_FOR_END
        default:
            return null;
    }
}

export const focusElement = (id) => {
    const element = document.getElementById(id)
    if (element)
        element.focus()
}

export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0
}
// export const convertMetaDataTab = (meta) => {
//     switch (meta) {
//         case "IMGO":
//             return <Tag color="green">Тодорхойлолт</Tag>
//         case "Аргачлал":
//             return <Tag color="green">Аргачлал</Tag>
//         default:
//             return meta;    
//     }
// }
export const sortArray = (list, sortField) => {
    return list.sort((a, b) => (a[sortField] > b[sortField]) ? 1 : -1)
}