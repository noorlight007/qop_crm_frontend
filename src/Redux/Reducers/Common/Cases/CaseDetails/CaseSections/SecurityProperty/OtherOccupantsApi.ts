import { baseApi } from "@/Redux/Api/BaseApi";

export const OtherOccupantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOtherOccupants: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/other/occupants/`,
        method: "GET",
      }),
      providesTags: ["OtherOccupants"],
    }),
    addOtherOccupant: builder.mutation({
      query: ({ case_alias, newOccupant }) => ({
        url: `/cases/${case_alias}/other/occupants/`,
        method: "POST",
        body: newOccupant,
      }),
      invalidatesTags: ["OtherOccupants"],
    }),
    updateOtherOccupant: builder.mutation({
      query: ({ case_alias, occupant_alias, updatedOccupant }) => ({
        url: `/cases/${case_alias}/other/occupants/${occupant_alias}/`,
        method: "PATCH",
        body: updatedOccupant,
      }),
      invalidatesTags: ["OtherOccupants"],
    }),
    deleteOtherOccupant: builder.mutation({
      query: ({ case_alias, occupant_alias }) => ({
        url: `/cases/${case_alias}/other/occupants/${occupant_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OtherOccupants"],
    }),
  }),
});

export const {
  useGetOtherOccupantsQuery,
  useAddOtherOccupantMutation,
  useUpdateOtherOccupantMutation,
  useDeleteOtherOccupantMutation,
} = OtherOccupantsApi;
