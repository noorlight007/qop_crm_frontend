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
  }),
});

export const {
  useGetAdvertisersQuery,
  useGetAdvertiserDetailsQuery,
  useAddAdvertiserMutation,
  useEditAdvertiserMutation,
} = AdvertisersApi;
