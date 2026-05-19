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
  }),
});

export const { useGetAdvertisersQuery } = AdvertisersApi;
