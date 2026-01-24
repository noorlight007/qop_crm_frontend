import { baseApi } from "@/Redux/Api/BaseApi";

export const ResetUserPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resetUserPassword: builder.mutation({
      query: ({ payload, uid, token }) => ({
        url: `/auth/reset-password/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ResetPassword"],
    }),
  }),
});

export const { useResetUserPasswordMutation } = ResetUserPasswordApi;
