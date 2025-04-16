declare module "axios" {
  export interface AxiosRequestConfig {
    toastify?: boolean;
    loadingMessage?: string;
  }
}

export type ApiResponse<T> = {
  success?: boolean;
  data: T;
};

export type ApiError = {
  message: string;
  status: boolean;
  code: number;
};

export type PaginateData<Data> = {
  data_per_page: Data;
  meta: {
    page: number;
    max_page: number;
  };
};

export interface PaginatedApiResponse<DataType> {
  code: number;
  status: boolean;
  message: string;
  data: PaginateData<DataType>;
}
