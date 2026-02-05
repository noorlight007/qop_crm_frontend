import { baseApi } from "@/Redux/Api/BaseApi";

export const DocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaseDocuments: builder.query({
      query: ({ case_alias, page, page_size, file_type }) => {
        const params: Record<string, string> = {};
        if (page !== undefined) params.page = String(page);
        if (page_size !== undefined) params.page_size = String(page_size);
        if (file_type) params.file_type = String(file_type);
        const queryString = Object.keys(params).length
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return {
          url: `/cases/${case_alias}/files/${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["CaseDocuments"],
    }),

    getFileCount: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/file-count/`,
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
  useGetFileCountQuery,
  useUploadCaseDocumentMutation,
  useUpdateCaseDocumentMutation,
  useDeleteCaseDocumentMutation,
} = DocumentsApi;
