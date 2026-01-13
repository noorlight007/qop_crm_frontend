import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const SetNewPasswordApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    setNewPassword: builder.mutation({
      query: ({ payload, uid, token }) => ({
        url: `/auth/set-password/${uid}/${token}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SetPassword"],
    }),
  }),
});

export const { useSetNewPasswordMutation } = SetNewPasswordApi;
