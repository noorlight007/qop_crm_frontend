import { authBaseApi } from "@/Redux/Api/AuthBaseApi";
import { baseApi } from "@/Redux/Api/BaseApi";

export const AppearanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprance: builder.query({
      query: () => ({
        url: `/appearance-settings/`,
        method: "GET",
      }),
      providesTags: ["AppearanceSettings"],
    }),
    updateAppearance: builder.mutation({
      query: ({ payload }) => ({
        url: `/appearance-settings/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AppearanceSettings"],
    }),
  }),
});
export const { useGetAppranceQuery, useUpdateAppearanceMutation } =
  AppearanceApi;

export const AppearancePublicApi = authBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicApprance: builder.query({
      query: () => ({
        url: `/appearance-settings/`,
        method: "GET",
      }),
      providesTags: ["AppearanceSettings"],
    }),
  }),
});
export const { useGetPublicAppranceQuery } = AppearancePublicApi;
