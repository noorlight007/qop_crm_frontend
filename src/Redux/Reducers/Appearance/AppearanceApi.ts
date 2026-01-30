import { baseApi } from "@/Redux/Api/BaseApi";
import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";
import { setFavIcon, setSiteTitle } from "./AppearanceSlice";

export const AppearanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprance: builder.query({
      query: () => ({
        url: `/appearance-settings/`,
        method: "GET",
      }),
      providesTags: ["AppearanceSettings"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.site_title) {
            dispatch(setSiteTitle(data.site_title));
          }
          if (data?.fav_icon) {
            dispatch(setFavIcon(data.fav_icon));
          }
        } catch (err) {
          // Handle error silently
        }
      },
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

export const AppearancePublicApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicApprance: builder.query({
      query: () => ({
        url: `/appearance-settings/`,
        method: "GET",
      }),
      providesTags: ["AppearanceSettings"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.site_title) {
            dispatch(setSiteTitle(data.site_title));
          }
          if (data?.fav_icon) {
            dispatch(setFavIcon(data.fav_icon));
          }
        } catch (err) {
          // Handle error silently
        }
      },
    }),
  }),
});
export const { useGetPublicAppranceQuery } = AppearancePublicApi;
