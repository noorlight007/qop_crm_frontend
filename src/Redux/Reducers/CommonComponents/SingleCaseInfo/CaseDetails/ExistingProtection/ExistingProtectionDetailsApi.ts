import { baseApi } from "@/Redux/Api/BaseApi";

export const ExistingProtectionDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExistingProtectionDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/existing/protections/`,
        method: "GET",
      }),
      providesTags: ["ExistingProtectionDetails"],
    }),
    addExistingProtectionDetails: builder.mutation({
      query: ({
        case_alias,
        existingProtection_id,
        existingProtectionDetailsPayload,
      }) => ({
        url: `/cases/${case_alias}/existing/protections/${existingProtection_id}/`,
        method: "POST",
        body: existingProtectionDetailsPayload,
      }),
      invalidatesTags: ["ExistingProtectionDetails"],
    }),
    updateExistingProtectionDetails: builder.mutation({
      query: ({
        case_alias,
        existingProtection_alias,
        existingProtectionUpdatePayload,
      }) => ({
        url: `/cases/${case_alias}/existing/protections/${existingProtection_alias}/`,
        method: "PUT",
        body: existingProtectionUpdatePayload,
      }),
      invalidatesTags: ["ExistingProtectionDetails"],
    }),
  }),
});

export const {
  useGetExistingProtectionDetailsQuery,
  useAddExistingProtectionDetailsMutation,
  useUpdateExistingProtectionDetailsMutation,
} = ExistingProtectionDetailsApi;
