import { publicBaseApi } from "@/Redux/Api/PublicBaseApi";

export const PublicEnquiryApi = publicBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitEnquiry: builder.mutation({
      query: ({ payload }) => ({
        url: `/public/lead/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Enquiry"],
    }),
  }),
});

export const { useSubmitEnquiryMutation } = PublicEnquiryApi;
