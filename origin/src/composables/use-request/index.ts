import { defineAxiosInstance } from "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts";
import { axiosInstance } from "./createAxiosInstance.ts";

defineAxiosInstance(axiosInstance);

export { useRequestIn01s as useRequest } from "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts";
