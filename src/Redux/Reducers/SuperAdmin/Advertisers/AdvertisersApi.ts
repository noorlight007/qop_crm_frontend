import { baseApi } from "@/Redux/Api/BaseApi";

export const AdvertisersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisers: builder.query({
      query: () => ({
        url: `/api/advertisers/`,
        method: "GET",
      }),
      providesTags: ["AdvertisersDetails"],
    }),
  }),
});

export const { useGetAdvertisersQuery } = AdvertisersApi;
