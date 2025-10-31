import { baseApi } from "@/Redux/Api/BaseApi";

export const MyTasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Accepts optional pagination/search params and forwards them to the API
    getMyTasks: builder.query<
      any,
      { page?: number; page_size?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/dashboard/tasks/",
        params: params || {},
      }),
    }),
  }),
});

export const { useGetMyTasksQuery } = MyTasksApi;
