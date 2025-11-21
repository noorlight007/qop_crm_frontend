import { baseApi } from "@/Redux/Api/BaseApi";

export const PortfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioDetails: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/properties/`,
        method: "GET",
      }),
      providesTags: ["PortfolioDetails"],
    }),
    getPortfolioApplicants: builder.query({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/user/list/`,
        method: "GET",
      }),
      providesTags: ["PortfolioDetails"],
    }),
    addPropertyDetails: builder.mutation({
      query: ({ case_alias, propertyDetails }) => ({
        url: `/cases/${case_alias}/properties/`,
        method: "POST",
        body: propertyDetails,
      }),
      invalidatesTags: ["PortfolioDetails"],
    }),
    deletePropertyDetails: builder.mutation({
      query: ({ case_alias, property_alias }) => ({
        url: `/cases/${case_alias}/properties/${property_alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PortfolioDetails"],
    }),
    exportPropertiesCSV: builder.mutation({
      query: ({ case_alias }) => ({
        url: `/cases/${case_alias}/export-properties/`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["PortfolioDetails"],
    }),
  }),
});

export const {
  useGetPortfolioDetailsQuery,
  useGetPortfolioApplicantsQuery,
  useAddPropertyDetailsMutation,
  useDeletePropertyDetailsMutation,
  useExportPropertiesCSVMutation,
} = PortfolioApi;
