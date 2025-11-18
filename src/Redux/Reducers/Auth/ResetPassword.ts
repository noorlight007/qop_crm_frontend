import { authBaseApi } from "@/Redux/Api/AuthBaseApi";

export const ResetPasswordApi = authBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: ({ payload, uid, token }) => ({
        url: `/auth/users/reset_password_confirm/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ResetPassword"],
    }),
  }),
});

export const { useResetPasswordMutation } = ResetPasswordApi;
