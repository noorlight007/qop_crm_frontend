import { authBaseApi } from "@/Redux/Api/AuthBaseApi";

export const CaseDetailsApi = authBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    setNewPassword: builder.mutation({
      query: ({payload}) => ({
        url: `/set-password/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SetPassword"],
    }),
  }),
});

export const { useSetNewPasswordMutation } = CaseDetailsApi;
