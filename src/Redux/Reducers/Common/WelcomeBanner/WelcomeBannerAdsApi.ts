import { baseApi } from "@/Redux/Api/BaseApi";

export const WelcomeBannerAdsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWelcomeBannerAds: builder.query({
      query: () => ({
        url: `/api/advertisements/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetWelcomeBannerAdsQuery } = WelcomeBannerAdsApi;
