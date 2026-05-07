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
    getAssignedCompliance: builder.query({
      query: () => ({
        url: `/api/networks/compliance-assignments/`,
        method: "GET",
      }),
      providesTags: ["Compliance"],
    }),
    createAssignedCompliance: builder.mutation({
      query: (payload) => ({
        url: `/api/networks/compliance-assignments/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Compliance"],
    }),
    complianceSendRequest: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/send-request/`,
        method: "POST",
      }),
      invalidatesTags: ["Compliance"],
    }),
  }),
});

export const {
  useGetComplianceQuery,
  useUpdateComplianceMutation,
  useGetAssignedComplianceQuery,
  useCreateAssignedComplianceMutation,
  useComplianceSendRequestMutation,
} = ComplianceApi;
