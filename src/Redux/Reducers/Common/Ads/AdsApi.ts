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
    getAdClickCount: builder.query({
      query: (adsAlias) => ({
        url: `/api/advertisers/ads/${adsAlias}/click/`,
        method: "GET",
      }),
      providesTags: ["AdsDetails"],
    }),
    getAdImpressionCount: builder.query({
      query: (adsAlias) => ({
        url: `/api/advertisers/ads/${adsAlias}/impression/`,
        method: "GET",
      }),
      providesTags: ["AdsDetails"],
    }),
  }),
});

export const {
  useGetAdsQuery,
  useLazyGetAdClickCountQuery,
  useLazyGetAdImpressionCountQuery,
} = AdsApi;
