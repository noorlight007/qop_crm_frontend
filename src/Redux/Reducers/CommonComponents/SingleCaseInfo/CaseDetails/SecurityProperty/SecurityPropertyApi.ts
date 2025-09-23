import { baseApi } from "@/Redux/Api/BaseApi";

export const SecurityPropertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/property/details/`,
        method: "GET",
      }),
      providesTags: ["SecurityProperty"],
    }),
    updateProperty: builder.mutation({
      query: ({ case_alias, property_alias, updatedSecurityProperty }) => ({
        url: `/cases/${case_alias}/property/details/${property_alias}/`,
        method: "PUT",
        body: updatedSecurityProperty,
      }),
      invalidatesTags: ["SecurityProperty"],
    }),
  }),
});

export const { useGetPropertiesQuery, useUpdatePropertyMutation } =
  SecurityPropertyApi;
