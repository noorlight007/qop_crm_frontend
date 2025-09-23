import { baseApi } from "@/Redux/Api/BaseApi";

export const SolicitorAndAccountantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Solicitor
    getSolicitorDetails: builder.query({
      query: () => ({
        url: `/cases/solicitors/`,
        method: "GET",
      }),
      providesTags: ["SolicitorDetails"],
    }),
    addSolicitorDetails: builder.mutation({
      query: ({ solicitorDetails }) => ({
        url: `/cases/solicitors/`,
        method: "POST",
        body: solicitorDetails,
      }),
      invalidatesTags: ["SolicitorDetails"],
    }),
    getCaseSolicitorDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/case/solicitors/`,
        method: "GET",
      }),
      providesTags: ["SolicitorDetails"],
    }),
    assignCaseSolicitor: builder.mutation({
      query: ({ case_alias, solicitor }) => ({
        url: `/cases/${case_alias}/case/solicitors/`,
        method: "POST",
        body: solicitor,
      }),
      invalidatesTags: ["SolicitorDetails"],
    }),
    updateSolicitorDetails: builder.mutation({
      query: ({ solicitor_alias, updatedSolicitorDetails }) => ({
        url: `/cases/solicitors/${solicitor_alias}/`,
        method: "PUT",
        body: updatedSolicitorDetails,
      }),
      invalidatesTags: ["SolicitorDetails"],
    }),
    // Accountant
    getAccountantDetails: builder.query({
      query: () => ({
        url: `/cases/accountants/`,
        method: "GET",
      }),
      providesTags: ["AccountantDetails"],
    }),
    addAccountantDetails: builder.mutation({
      query: ({ accountantDetails }) => ({
        url: `/cases/accountants/`,
        method: "POST",
        body: accountantDetails,
      }),
      invalidatesTags: ["AccountantDetails"],
    }),
    updateAccountantDetails: builder.mutation({
      query: ({alias, data }) => ({
        url: `/cases/accountants/${alias}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AccountantDetails"],
    }),
    getCaseAccountantDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/case/accountants/`,
        method: "GET",
      }),
      providesTags: ["AccountantDetails"],
    }),
    assignCaseAccountant: builder.mutation({
      query: ({ case_alias, accountant }) => ({
        url: `/cases/${case_alias}/case/accountants/`,
        method: "POST",
        body: accountant,
      }),
      invalidatesTags: ["AccountantDetails"],
    }),
  }),
});

export const {
  useGetSolicitorDetailsQuery,
  useAddSolicitorDetailsMutation,
  useGetCaseSolicitorDetailsQuery,
  useAssignCaseSolicitorMutation,
  useUpdateSolicitorDetailsMutation,
  useGetAccountantDetailsQuery,
  useUpdateAccountantDetailsMutation,
  useAddAccountantDetailsMutation,
  useGetCaseAccountantDetailsQuery,
  useAssignCaseAccountantMutation,
} = SolicitorAndAccountantApi;
