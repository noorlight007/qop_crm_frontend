import { baseApi } from "@/Redux/Api/BaseApi";

export const ComplianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompliance: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/compliance/`,
        method: "GET",
      }),
      providesTags: ["Compliance"],
    }),
    updateCompliance: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/compliance/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Compliance"],
    }),
  }),
});

export const {
  useGetComplianceQuery,
  useUpdateComplianceMutation,
} = ComplianceApi;
