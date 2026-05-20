import { baseApi } from "@/Redux/Api/BaseApi";

export const AdvertisersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisers: builder.query({
      query: (params) => ({
        url: `/api/advertisers/`,
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["AdvertisersDetails"],
    }),
    getAdvertiserDetails: builder.query({
      query: ({ alias }) => ({
        url: `/api/advertisers/${alias}/`,
        method: "GET",
      }),
      providesTags: ["AdvertisersDetails"],
    }),
    addAdvertiser: builder.mutation({
      query: (payload) => ({
        url: `/api/advertisers/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
    editAdvertiser: builder.mutation({
      query: ({ alias, ...payload }) => ({
        url: `/api/advertisers/${alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
    deleteAdvertiser: builder.mutation<null, { alias: string }>({
      query: ({ alias }) => ({
        url: `/api/advertisers/${alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
    getAdvertiserAds: builder.query({
      query: ({ alias, ...params }) => ({
        url: `/api/advertisers/${alias}/ads/`,
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["AdvertisersDetails"],
    }),
    addAdvertiserAd: builder.mutation({
      query: ({ alias, payload }) => ({
        url: `/api/advertisers/${alias}/ads/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
    editAdvertiserAd: builder.mutation({
      query: ({ alias, adAlias, payload }) => ({
        url: `/api/advertisers/${alias}/ads/${adAlias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
    deleteAdvertiserAd: builder.mutation({
      query: ({ alias, adAlias }) => ({
        url: `/api/advertisers/${alias}/ads/${adAlias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvertisersDetails"],
    }),
  }),
});

export const {
  useGetAdvertisersQuery,
  useGetAdvertiserDetailsQuery,
  useAddAdvertiserMutation,
  useEditAdvertiserMutation,
  useDeleteAdvertiserMutation,
  useGetAdvertiserAdsQuery,
  useAddAdvertiserAdMutation,
  useEditAdvertiserAdMutation,
  useDeleteAdvertiserAdMutation,
} = AdvertisersApi;
