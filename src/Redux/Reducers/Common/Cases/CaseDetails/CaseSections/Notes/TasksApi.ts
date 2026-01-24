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
      query: ({ case_alias, page }: { case_alias: string; page?: number }) => {
        const base = `/cases/${case_alias}/tasks/`;
        const url = page ? `${base}?page=${page}` : base;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Tasks"],
    }),
    editTask: builder.mutation({
      query: ({ case_alias, task_alias, taskPayload }) => ({
        url: `/cases/${case_alias}/tasks/${task_alias}/`,
        method: "PATCH",
        body: taskPayload,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const { useAddTasksMutation, useGetTasksQuery, useEditTaskMutation } =
  TasksApi;
