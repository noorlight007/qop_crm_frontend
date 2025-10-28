import { baseApi } from "@/Redux/Api/BaseApi";

export const TasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTasks: builder.mutation({
      query: ({ case_alias, task }) => ({
        url: `/cases/${case_alias}/tasks/`,
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getTasks: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/tasks/`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
  }),
});

export const { useAddTasksMutation, useGetTasksQuery } = TasksApi;