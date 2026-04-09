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
      query: ({ payload, subdomain, uid, token, type }) => ({
        url: `/auth/forgot-password/${subdomain}/${type}/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ForgotPassword"],
    }),
  }),
});

export const { useForgotPasswordSendEmailMutation, useForgotPasswordMutation } =
  ForgotPasswordApi;
