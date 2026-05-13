import { baseApi } from "@/Redux/Api/BaseApi";

export const CommonFiltersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkFilterList: builder.query({
        query: () => ({
            url: "/filters/networks/",
            method: "GET",
        }),
        providesTags: ["CommonFilters"],
    }),
    getOrganisationFilterList: builder.query({
        query: (params) => ({
            url: "/filters/organisations/",
            method: "GET",
            params,
        }),
        providesTags: ["CommonFilters"],
    }),
  }),
});

export const {
  useGetNetworkFilterListQuery,
  useGetOrganisationFilterListQuery,
} = CommonFiltersApi;