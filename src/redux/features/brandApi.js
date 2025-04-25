import { apiSlice } from "../api/apiSlice";


export const brandApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    getActiveBrands: builder.query({
      query: () => `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/brand/active`
    }),
  }),
});

export const {
 useGetActiveBrandsQuery
} = brandApi;
