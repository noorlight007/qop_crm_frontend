import { baseApi } from "@/Redux/Api/BaseApi";

export const NeedsAndPreferencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNeedsAndPreferences: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/mortgage/`,
        method: "GET",
      }),
      providesTags: ["NeedsAndPreferences"],
    }),
    updateNeedsAndPreferences: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/mortgage/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["NeedsAndPreferences"],
    }),
  }),
});

export const {
  useGetNeedsAndPreferencesQuery,
  useUpdateNeedsAndPreferencesMutation,
} = NeedsAndPreferencesApi;
