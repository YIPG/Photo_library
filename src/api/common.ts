import axios from "axios";
import { config } from "./config";

export async function getRequest<T>(path: string): Promise<T> {
  return axios
    .request<T>({ url: `${config.apiUrl}${path}` })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
}
