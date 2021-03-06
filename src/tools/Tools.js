import {
  faBookOpen,
  faChartBar,
  faClipboard,
  faFolderOpen,
  faHandsHelping,
  faProjectDiagram,
  faSquare,
  faTasks,
  faUser,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import { message, Tag } from 'antd';
import { Warning } from '../components/Confirm';
import { ORG_STEP, ORG_WISH } from '../constants/Constant';
import { FILTER_MODE } from '../constants/LazyTable';

export const convertLazyParamsToObj = (lazyParams, searchParam = null) => {
  const obj = { search: searchParam || '' };
  if (lazyParams.sortField) {
    obj.sort = `${lazyParams.sortField},${
      lazyParams.sortOrder > 0 ? 'asc' : 'desc'
    }`;
  }
  if (lazyParams.page) {
    obj.page = lazyParams.page;
  }
  if (lazyParams.page) {
    obj.size = lazyParams.size;
  }
  if (lazyParams.filters) {
    Object.entries(lazyParams.filters).forEach(([key, value]) => {
      if (obj.search !== '') {
        obj.search += ' AND ';
      }
      if (value.matchMode === 'in') {
        obj.search += '(';
        value.value.forEach(element => {
          obj.search += `${
            obj.search.endsWith('(') ? '' : ' OR '
          }${key}:${element}`;
        });
        obj.search += ')';
      } else if (value.matchMode === FILTER_MODE.CONTAINS) {
        obj.search += `${key}:*${value.value}*`;
      } else if (value.matchMode === FILTER_MODE.EQUALS) {
        obj.search += `${key}:${value.value}`;
      } else if (value.matchMode === FILTER_MODE.STARTS_WITH) {
        obj.search += `${key}:${value.value}*`;
      } else if (value.matchMode === FILTER_MODE.ENDS_WITH) {
        obj.search += `${key}:*${value.value}`;
      }
    });
  }
  return obj;
};

export const errorCatch = error => {
  if (!error) {
    message.error('Алдаа!!!');
    return;
  }
  if (error.response && error.response.data) {
    if (typeof error.response.data === 'string') {
      message.warning(error.response.data);
    } else {
      message.warning(
        `${error.response.data.error}\t${error.response.status}\n${error.response.data.path}`
      );
    }
  } else if (error.request) {
    let msg = `${error.request.statusText}-${error.request.status}; `;
    if (error.response && error.response.config) {
      const urls = error.response.config.url?.split('?');
      msg += urls[0];
    }
    if (
      error.request.statusText === 'Forbidden' &&
      error.request.status === 403
    ) {
      Warning();
      return;
    }
    if (
      error.request.statusText === 'Unauthorized' &&
      error.request.status === 401
    ) {
      window.location.href = '/';
      return;
    }
    message.warning(msg);
  } else {
    message.warning(error.message);
  }
};

export const requireFieldFocus = () => {
  message.warning('Заавал бөглөх талбаруудыг бөглөнө үү');
  const el = document.querySelector(`.ant-form-item-has-error .ant-input,
    .ant-form-item-has-error .ant-select-selection-search-input,
    .ant-form-item-has-error .ant-input-number-input`);
  if (el) el.focus();
};

export const convertOrgStep = step => {
  switch (step) {
    case ORG_STEP.ACTIVE:
      return <Tag color="yellow">Илгээсэн</Tag>;
    case ORG_STEP.APPROVED:
      return <Tag color="green">Зөвшөөрсөн</Tag>;
    case ORG_STEP.REJECTED:
      return <Tag color="red">Татгалзсан</Tag>;
    case ORG_STEP.EXPIRED:
      return <Tag color="yellow">Хугацаа хэтэрсэн</Tag>;
    default:
      return step;
  }
};

export const formatIndicator = indicator => {
  switch (indicator) {
    case 1:
      return '%';
    case 2:
      return '';
    case 3:
      return '';
    default:
      return '';
  }
};

export const formatFrequency = frequency => {
  switch (frequency) {
    case '1':
      return 'Улирал тутам';
    case '2':
      return 'Жил тутам';
    case '3':
      return 'Суурь, дунд хугацаанд болон төгсгөлд';
    case '4':
      return 'Төслийн төгсгөлд';
    default:
      return 'Тодорхойгүй';
  }
};

export const formatFormula = indicator => {
  switch (indicator) {
    case 1:
      return 'Хувь';
    case 2:
      return 'Тоо';
    case 3:
      return 'Томьёо';
    default:
      return 'Тодорхойгүй';
  }
};

export const menuIcon = code => {
  switch (code) {
    case 'User':
      return faUser;
    case 'Indicator':
      return faChartBar;
    case 'Training':
      return faBookOpen;
    case 'Project':
      return faTasks;
    case 'Project implementing unit':
      return faProjectDiagram;
    case 'Directory registration':
      return faFolderOpen;
    case 'Consulting service':
      return faHandsHelping;
    case 'Dashboard':
      return faClipboard;
    case 'settings':
      return faUserCog;
    default:
      return faSquare;
  }
};

export const convertOrgWish = wish => {
  switch (wish) {
    case ORG_WISH.CREATE:
      return <Tag color="green">Байгууллага шинээр бүртгүүлэх хүсэлт</Tag>;
    case ORG_WISH.CHANGE_INFO:
      return <Tag color="yellow">Мэдээлэлд өөрчлөлт оруулах хүсэлт</Tag>;
    case ORG_WISH.ESTABLISH:
      return <Tag color="orange">Өөрчлөн байгуулах хүсэлт</Tag>;
    case ORG_WISH.REQUEST_FOR_END:
      return <Tag color="red">Дуусгавар болгох хүсэлт</Tag>;
    default:
      return wish;
  }
};

export const convertWish = selectedWishStr => {
  switch (selectedWishStr) {
    case 'create':
      return ORG_WISH.CREATE;
    case 'update':
      return ORG_WISH.CHANGE_INFO;
    case 'change':
      return ORG_WISH.ESTABLISH;
    case 'inactive':
      return ORG_WISH.REQUEST_FOR_END;
    default:
      return null;
  }
};

export const focusElement = id => {
  const element = document.getElementById(id);
  if (element) element.focus();
};

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;

export const sortArray = (list, sortField) => {
  if (!list) return [];
  return list.sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));
};

/** Search Date */

const formatDate = date => {
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
};

export const filterDate = (value, filter) => {
  if (
    filter === undefined ||
    filter === null ||
    (typeof filter === 'string' && filter.trim() === '')
  ) {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  return value === formatDate(filter);
};
