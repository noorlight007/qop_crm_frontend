import { baseApi } from "@/Redux/Api/BaseApi";

export const AuthUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkList: builder.query({
      query: (params) => ({
        url: "/filters/networks/",
        method: "GET",
        params,
      }),
      providesTags: ["AuthUsers"],
    }),
    getOrganisationList: builder.query({
      query: (params) => ({
        url: "/filters/organisations/",
        method: "GET",
        params,
      }),
      providesTags: ["AuthUsers"],
    }),
    
  }),
});
export const {
  useGetNetworkListQuery,
  useGetOrganisationListQuery,
} = AuthUsersApi;
