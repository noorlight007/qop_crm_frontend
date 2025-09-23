import { baseApi } from "@/Redux/Api/BaseApi";

export const NotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNotes: builder.mutation({
      query: ({ case_alias, note }) => ({
        url: `/cases/${case_alias}/notes/`,
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Notes"],
    }),
    getNotes: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/notes/`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
  }),
});

export const { useAddNotesMutation, useGetNotesQuery } = NotesApi;
