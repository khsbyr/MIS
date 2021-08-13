import { message } from 'antd';
import { errorCatch } from '../tools/Tools';
import axios from './axios';

const config = () => ({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    AccessToken: `${localStorage.getItem('token')}`,
  },
});

export async function getService(
  serviceName,
  // param = null,
  isShowErrorMessage = true
) {
  // let params = "?search=status:true";
  // let isSeparate = false;
  // if (param) {
  //   if (param.search) {
  //     params += " AND " + param.search;
  //     isSeparate = true;
  //   }
  //   if (param.sort) {
  //     if (isSeparate) params += "&";
  //     params += "sort=" + param.sort;
  //     isSeparate = true;
  //   }
  //   if (param.page) {
  //     if (isSeparate) params += "&";
  //     params += "page=" + param.page;
  //     isSeparate = true;
  //   }
  //   if (param.size) {
  //     if (isSeparate) params += "&";
  //     params += "size=" + param.size;
  //     isSeparate = true;
  //   }
  // }
  const response = await axios.get(serviceName, config()).catch(error => {
    if (isShowErrorMessage) errorCatch(error);
    throw error;
  });
  return response?.data;
}

export async function postService(serviceName, data) {
  const response = await axios
    .post(serviceName, data, config())
    .catch(error => {
      throw error;
    });
  if (response.status !== 200) {
    message.warning('АМЖИЛТГҮЙ:', response.statusText);
  }
  return response;
}

export async function putService(serviceName, data = null) {
  const response = await axios.put(serviceName, data, config()).catch(error => {
    errorCatch(error);
    throw error;
  });
  if (response.status !== 200) {
    message.warning('АМЖИЛТГҮЙ:', response.statusText);
  }
  return response.data;
}

export async function deleteService(serviceName, data) {
  return await axios.delete(serviceName, { data, ...config() }).catch(error => {
    errorCatch(error);
    throw error;
  });
}

export async function patchService(serviceName, data = null) {
  return await axios.patch(serviceName, data, config()).catch(error => {
    errorCatch(error);
    throw error;
  });
}

export async function getGenerateUuid() {
  return await axios.get('gap-file-service/files/generateUuid', config());
}

export function writeFileServer(selectedFile, generateUuid) {
  const data = new FormData();
  data.append('file', selectedFile);
  axios
    .post(`gap-file-service/files?parentUuid=${generateUuid}`, data, config())
    .catch(error => {
      errorCatch(error);
      throw error;
    });
}
