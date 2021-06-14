import { message } from "antd";
import axios from "./axios";

export async function getService(serviceName, param = null) {
  let params = "?search=status:true";
  let isSeparate = false;
  if (param) {
    if (param.search) {
      params += " AND " + param.search;
      isSeparate = true;
    }
    if (param.sort) {
      if (isSeparate) params += "&";
      params += "sort=" + param.sort;
      isSeparate = true;
    }
    if (param.page) {
      if (isSeparate) params += "&";
      params += "page=" + param.page;
      isSeparate = true;
    }
    if (param.size) {
      if (isSeparate) params += "&";
      params += "size=" + param.size;
      isSeparate = true;
    }
  }
  return (await axios.get(serviceName + params)).data;
}

export async function postService(serviceName, data) {
  const response = await axios.post(serviceName, data);
  if (response.status === 200) console.log("Амжилттай хадгалагдлаа");
  else message.warning("АМЖИЛТГҮЙ:", response.statusText);
  return response;
}

export async function putService(serviceName, data = null) {
  const response = await axios.put(serviceName, data);
  if (response.status === 200) console.log("Амжилттай хадгалагдлаа");
  else message.warning("АМЖИЛТГҮЙ:", response.statusText);
  return response.data;
}

export async function deleteService(serviceName, data) {
  return await axios.delete(serviceName, { data });
}

export async function getGenerateUuid() {
  return await axios.get("gap-file-service/files/generateUuid");
}

export function writeFileServer(selectedFile, generateUuid) {
  const data = new FormData();
  data.append("file", selectedFile);
  axios
    .post("gap-file-service/files?parentUuid=" + generateUuid, data)
    .then((res) => {
      console.log(res.statusText);
    })
    .catch((err) => {
      console.log("err: ", err);
      alert("upload fail");
    });
}
