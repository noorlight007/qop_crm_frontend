import { baseApi } from "@/Redux/Api/BaseApi";

export const PropertyEPCRatingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyEPCRating: builder.mutation({
        query: ({ case_alias, property_postcode, property_address }) => ({
        url: `/cases/${case_alias}/property/details/epc-rating/`,
        method: "Post",
        body: {
          postcode: property_postcode,
          address: property_address,
        },
        }),
        invalidatesTags: ["SecurityProperty"],
    }),
    }),
});

export const { useGetPropertyEPCRatingMutation } = PropertyEPCRatingApi; 