import { baseApi } from "@/Redux/Api/BaseApi";

export const AdsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAds: builder.query({
      query: () => ({
        url: `/api/advertisers/ads/`,
        method: "GET",
      }),
      providesTags: ["AdsDetails"],
    }),
    addAd: builder.mutation({
      query: (payload) => ({
        url: `/api/advertisements/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdsDetails"],
    }),
  }),
});

export const { useGetAdsQuery, useAddAdMutation } = AdsApi;
