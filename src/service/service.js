import { message } from "antd";
import axios from "./axios";

let config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    // "Access-Control-Allow-Credentials": "true",
  },
};
export async function getService(serviceName) {
  return (await axios.get(serviceName, config)).data;
}

export async function postService(serviceName, data) {
  console.log(config);
  const response = await axios.post(serviceName, data, config);
  if (response.status === 200) console.log("Амжилттай хадгалагдлаа");
  else message.warning("АМЖИЛТГҮЙ:", response.statusText);
  return response;
}

export async function putService(serviceName, data = null) {
  const response = await axios.put(serviceName, data, config);
  if (response.status === 200) console.log("Амжилттай хадгалагдлаа");
  else message.warning("АМЖИЛТГҮЙ:", response.statusText);
  return response.data;
}

export async function deleteService(serviceName, data) {
  return await axios.delete(serviceName, { data }, config);
}
