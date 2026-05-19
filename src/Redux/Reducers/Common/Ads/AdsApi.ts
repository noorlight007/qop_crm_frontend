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
        // Tracking endpoints often respond with a redirect (302) after recording the event.
        responseHandler: "text",
        validateStatus: (response) =>
          response.status === 200 ||
          response.status === 204 ||
          response.status === 302,
      }),
      providesTags: ["AdsDetails"],
    }),
    getAdImpressionCount: builder.query({
      query: (adsAlias) => ({
        url: `/api/advertisers/ads/${adsAlias}/impression/`,
        method: "GET",
        responseHandler: "text",
        validateStatus: (response) =>
          response.status === 200 ||
          response.status === 204 ||
          response.status === 302,
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
