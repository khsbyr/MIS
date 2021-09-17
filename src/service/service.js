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

export async function getService(serviceName, queryParams = null) {
  let params = `${serviceName.includes('?') ? '&' : '?'}`;
  if (queryParams) {
    if (queryParams.search) {
      params += `search=${queryParams.search}`;
    }
    ['sort', 'page', 'size'].forEach(param => {
      if (queryParams[param]) {
        params += `&${param}=${queryParams[param]}`;
      }
    });
  }
  let response = null;
  try {
    response = await axios.get(serviceName + params, config());
  } catch (error) {
    errorCatch(error);
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

export async function writeFileServer(serviceName, file) {
  const data = new FormData();
  data.append('file', file);
  const response = await axios
    .post(serviceName, data, config())
    .catch(error => {
      errorCatch(error);
      throw error;
    });
  if (response.status !== 200) {
    message.warning('АМЖИЛТГҮЙ:', response.statusText);
  }
  return response;
}

export async function writeMultipleFileServer(serviceName, files) {
  const data = new FormData();
  files.forEach(file => {
    data.append('files', file.originFileObj);
  });
  const response = await axios
    .post(serviceName, data, config())
    .catch(error => {
      errorCatch(error);
      throw error;
    });
  if (response.status !== 200) {
    message.warning('АМЖИЛТГҮЙ:', response.statusText);
  }
  return response;
}

export async function updateFileServer(serviceName, file) {
  const data = new FormData();
  data.append('file', file);
  const response = await axios.put(serviceName, data, config()).catch(error => {
    errorCatch(error);
    throw error;
  });
  if (response.status !== 200) {
    message.warning('АМЖИЛТГҮЙ:', response.statusText);
  }
  return response;
}
