import { baseApi } from "@/Redux/Api/BaseApi";

export const AddUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (formPayload) => ({
        url: `/auth/users/`,
        method: "POST",
        body: formPayload,
      }),
      invalidatesTags: ["AddUser"],
    }),
  }),
});

export const { useAddUserMutation } = AddUserApi;
