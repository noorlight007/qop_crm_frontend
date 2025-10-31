import { baseApi } from "@/Redux/Api/BaseApi";

export const MyTasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTasks: builder.query({
      query: () => "/dashboard/tasks/",
    }),
  }),
});

export const { useGetMyTasksQuery } = MyTasksApi;
