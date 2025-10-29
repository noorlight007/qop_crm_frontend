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
      // Accept optional params for paginated & filtered endpoints
      query: ({
        case_alias,
        page,
        category,
      }: {
        case_alias: string;
        page?: number;
        category?: string;
      }) => {
        const base = `/cases/${case_alias}/notes/`;
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (category) params.append("category", String(category));
        const url = params.toString() ? `${base}?${params.toString()}` : base;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Notes"],
    }),
  }),
});

export const { useAddNotesMutation, useGetNotesQuery } = NotesApi;
