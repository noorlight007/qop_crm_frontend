import { baseApi } from "@/Redux/Api/BaseApi";

export const ResetUserPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resetUserPassword: builder.mutation({
      query: ({ payload, subdomain, uid, token }) => ({
        url: `/auth/reset-password/${subdomain}/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ResetPassword"],
    }),
  }),
});

export const { useResetUserPasswordMutation } = ResetUserPasswordApi;
