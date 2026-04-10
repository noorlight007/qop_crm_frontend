import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const SetNewPasswordApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    setNewPassword: builder.mutation({
      query: ({ payload, subdomain, uid, token, type }) => ({
        url: `/auth/set-password/${subdomain}/${type}/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SetPassword"],
    }),
  }),
});

export const { useSetNewPasswordMutation } = SetNewPasswordApi;
