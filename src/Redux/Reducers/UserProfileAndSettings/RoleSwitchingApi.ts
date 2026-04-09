import { baseApi } from "@/Redux/Api/BaseApi";

export const RoleSwitchingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserRoles: builder.query({
      query: () => ({
        url: `/api/permissions/switch-roles/`,
        method: "GET",
      }),
      providesTags: ["UserProfileDetails"],
    }),
    switchRole: builder.mutation({
      query: ({ role }) => ({
        url: `/api/permissions/switch-roles/`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["UserProfileDetails"],
    }),
  }),
});

export const { useGetUserRolesQuery, useSwitchRoleMutation } = RoleSwitchingApi;
