import { baseApi } from "@/Redux/Api/BaseApi";

export const CaseCopyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    copyCase: builder.mutation({
      query: ({ case_alias, payload }) => ({
        url: `/cases/${case_alias}/clone/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CaseCopy"],
    }),
  }),
});
export const { useCopyCaseMutation } = CaseCopyApi;
