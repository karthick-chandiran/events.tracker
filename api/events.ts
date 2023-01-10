import { Fetcher } from "swr";
import { IValidationError } from "./../models/IValidationError";
import { AxiosError } from "axios";
import { eventUrl } from "../common/constants";
import { IEventModel } from "./../models/IEventModel";
import axios from "./axios";

export async function addEvent(formData: Partial<IEventModel>) {
  const response = await axios
    .post<IEventModel[]>(eventUrl, formData)
    .catch((res: AxiosError<{ errors: IValidationError }>) => {
      const { errors } = res.response?.data || {};
      throw errors;
    });
  return response;
}

export async function updateEvent(formData: Partial<IEventModel>) {
  const response = await axios
    .put<IEventModel[]>(eventUrl, formData)
    .catch((res: AxiosError<{ errors: IValidationError }>) => {
      const { errors } = res.response?.data || {};
      throw errors;
    });
  return response;
}

export const getEvents = async (url: string) => {
  return await (
    await axios.get<IEventModel[]>(url)
  ).data;
};
