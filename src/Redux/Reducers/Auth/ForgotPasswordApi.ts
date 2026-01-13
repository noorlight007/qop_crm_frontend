import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const ForgotPasswordApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPasswordSendEmail: builder.mutation({
      query: ({ payload }) => ({
        url: `/auth/send-email/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ForgotPassword"],
    }),
    forgotPassword: builder.mutation({
      query: ({ payload, uid, token }) => ({
        url: `/auth/forgot-password/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ForgotPassword"],
    }),
  }),
});

export const { useForgotPasswordSendEmailMutation, useForgotPasswordMutation } =
  ForgotPasswordApi;
