import { baseApi } from "@/Redux/Api/BaseApi";

export const EmploymentDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmploymentDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/employment/details/`,
        method: "GET",
      }),
      providesTags: ["EmploymentDetails"],
    }),
    addEmploymentDetails: builder.mutation({
      query: ({ case_alias, employer_id, employmentDetails }) => ({
        url: `/cases/${case_alias}/employment/details/${employer_id}`,
        method: "POST",
        body: employmentDetails,
      }),
      invalidatesTags: ["EmploymentDetails"],
    }),
    updateEmploymentDetails: builder.mutation({
      query: ({ case_alias, employmentDetails_alias, employmentDetails }) => ({
        url: `/cases/${case_alias}/employment/details/${employmentDetails_alias}/`,
        method: "PUT",
        body: employmentDetails,
      }),
      invalidatesTags: ["EmploymentDetails"],
    }),
    deleteEmploymentDetails: builder.mutation({
      query: ({ case_alias, employmentDetails_alias }) => ({
        url: `/cases/${case_alias}/employment/details/${employmentDetails_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmploymentDetails"],
    }),
  }),
});

export const {
  useGetEmploymentDetailsQuery,
  useAddEmploymentDetailsMutation,
  useUpdateEmploymentDetailsMutation,
  useDeleteEmploymentDetailsMutation,
} = EmploymentDetailsApi;
