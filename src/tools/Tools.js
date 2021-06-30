import { message, Tag } from "antd";
import { ORG_STEP, ORG_WISH } from "./Constant";
export const convertLazyParamsToObj = (lazyParams, searchParam = null) => {
    let obj = { search: searchParam || '' }
    if (lazyParams.sortField)
        obj.sort = lazyParams.sortField + ',' + (lazyParams.sortOrder > 0 ? 'asc' : 'desc')
    if (lazyParams.page)
        obj.page = lazyParams.page
    if (lazyParams.filters) {
        Object.entries(lazyParams.filters).forEach(([key, value]) => {
            debugger
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
    if (error.response) {
        message.error(error.response.data?.error + '\t' + error.response.status)
    } else if (error.request) {
        console.log(error.request);
        message.error(error.request)
    } else {
        console.log('Error', error.message);
        message.error(error.message)
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
