import { Update } from "@/Constant";
import { baseApi } from "@/Redux/Api/BaseApi";

export const SectionCompleteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSectionCompleteStatus: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/sections-complete/`,
        method: "GET",
      }),
      providesTags: ["SectionCompleteStatus"],
    }),
    UpdateSectionCompleteStatus: builder.mutation({
      query: ({ case_alias, section_data }) => ({
        url: `/cases/${case_alias}/sections-complete/`,
        method: "PUT",
        body: section_data,
      }),
      invalidatesTags: ["SectionCompleteStatus"],
    }),
  }),
});

export const { useGetSectionCompleteStatusQuery, useUpdateSectionCompleteStatusMutation } = SectionCompleteApi;