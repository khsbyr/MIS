import { message } from 'antd';
import { errorCatch } from '../tools/Tools';
import axios from './axios';
import mockData from '../mock-data';

const config = () => ({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    AccessToken: `${localStorage.getItem('token')}`,
  },
});

export async function getService(serviceName, isShowErrorMessage = true) {
  let response = null;
  const serviceKey = serviceName.split('?')[0];
  try {
    response = await axios.get(serviceName, config());
  } catch (error) {
    if (isShowErrorMessage) errorCatch(error);
    if (process.env.NODE_ENV === 'development' && mockData[serviceKey]) {
      return mockData[serviceKey];
    }
    throw error;
  }
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
