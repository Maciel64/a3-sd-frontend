import axios, { type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
});

export const axiosMutator = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = api(config).then(({ data }) => data);
  return promise;
};
