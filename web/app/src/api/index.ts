import axios, { AxiosResponse } from "axios";
import { Provider } from "./types/provider";
import { GroupOrder } from "./types/groupOrder";

const baseURL = "/api";

const axi = axios.create({ baseURL });

const api = {
  provider: {
    list(): Promise<AxiosResponse<Provider[]>> {
      return axi.get("/provider");
    },
    get(pk: string): Promise<AxiosResponse<Provider>> {
      return axi.get(`/provider/${pk}`);
    },
    create(data: Provider): Promise<AxiosResponse<Provider>> {
      return axi.post("/provider", data);
    },
    delete(pk: string): Promise<AxiosResponse<null>> {
      return axi.delete(`/provider/${pk}`);
    },
    patch(pk: string, key: keyof Provider, value: Provider[keyof Provider]): Promise<AxiosResponse<Provider>> {
      return axi.patch(`/provider/${pk}`, { [key]: value });
    },
  },
  groupOrder: {
    list(): Promise<AxiosResponse<GroupOrder[]>> {
      return axi.get("/order");
    },
    get(pk: string): Promise<AxiosResponse<GroupOrder>> {
      return axi.get(`/order/${pk}`);
    },
    create(data: GroupOrder): Promise<AxiosResponse<GroupOrder>> {
      return axi.post("/order", data);
    },
    delete(pk: string): Promise<AxiosResponse<null>> {
      return axi.delete(`/order/${pk}`);
    },
    patch(pk: string, key: keyof GroupOrder, value: GroupOrder[keyof GroupOrder]): Promise<AxiosResponse<GroupOrder>> {
      return axi.patch(`/order/${pk}`, { [key]: value });
    },
  },
};

export default api;
