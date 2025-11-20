import { baseApi } from "@/Redux/Api/BaseApi";

export const InsuranceHealthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getInsuranceHealthDetails: builder.query({
            query: ({ case_alias }) => ({
                url: `/cases/${case_alias}/health-insurances/`,
                method: "GET",
            }),
            providesTags: ["InsuranceHealthDetails"],
        }),
        updateInsuranceHealthDetails: builder.mutation({
            query: ({ case_alias, body }) => ({
                url: `/cases/${case_alias}/health-insurances/`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["InsuranceHealthDetails"],
        }),
    }),
});
export const {
    useGetInsuranceHealthDetailsQuery,
    useUpdateInsuranceHealthDetailsMutation,
} = InsuranceHealthApi;