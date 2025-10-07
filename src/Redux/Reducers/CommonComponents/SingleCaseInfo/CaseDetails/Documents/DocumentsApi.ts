import { baseApi } from "@/Redux/Api/BaseApi";

export const DocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaseDocuments: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/files/`,
        method: "GET",
      }),
      providesTags: ["CaseDocuments"],
    }),

    uploadCaseDocument: builder.mutation({
      query: ({ case_alias, payload }) => {
        return {
          url: `/cases/${case_alias}/files/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["CaseDocuments"],
    }),

    updateCaseDocument: builder.mutation({
      query: ({ case_alias, file_alias, payload }) => ({
        url: `/cases/${case_alias}/files/${file_alias}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CaseDocuments"],
    }),

    deleteCaseDocument: builder.mutation({
      query: ({ case_alias, file_alias }) => ({
        url: `/cases/${case_alias}/files/${file_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CaseDocuments"],
    }),
  }),
});

export const {
  useGetCaseDocumentsQuery,
  useUploadCaseDocumentMutation,
  useUpdateCaseDocumentMutation,
  useDeleteCaseDocumentMutation,
} = DocumentsApi;
