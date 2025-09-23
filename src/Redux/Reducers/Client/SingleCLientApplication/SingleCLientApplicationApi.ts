import { baseApi } from "@/Redux/Api/BaseApi";

export const CaseDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getSingleClientApplication: builder.query({
      query: () => ({
        url: `/cases/`,
        method: "GET",
      }),
      providesTags: ["CLientApplicationDetails"],
    }),
   
  }),
});

export const {
 useGetSingleClientApplicationQuery
} = CaseDetailsApi;
