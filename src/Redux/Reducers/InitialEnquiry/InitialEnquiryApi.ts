import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const InitialEnquiryApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitEnquiry: builder.mutation({
        query: ({ payload }) => ({
            url: `/public/lead/`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["InitialEnquiry"],
    }),
  }),
});

export const { useSubmitEnquiryMutation } = InitialEnquiryApi;