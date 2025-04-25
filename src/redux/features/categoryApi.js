import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/category/add",
        method: "POST",
        body: data,
      }),
    }),
    getShowCategory: builder.query({
      query: () => `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/category/show`
    }),
    getProductTypeCategory: builder.query({
      query: (type) => `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/category/show/${type}`
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
} = categoryApi;
