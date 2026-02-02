import { baseApi } from "@/Redux/Api/BaseApi";

export const NetworksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkList: builder.query({
      query: (params) => ({
        url: "/organization/onboard/networks/",
        method: "GET",
        params,
      }),
      providesTags: ["NetworkList"],
    }),    
  }),
});
export const {
  useGetNetworkListQuery,
} = NetworksApi;
