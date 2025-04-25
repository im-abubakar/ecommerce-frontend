import { apiSlice } from "../../api/apiSlice";
import { set_client_secret } from "./orderSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // createPaymentIntent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/order/create-payment-intent`,
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(set_client_secret(result.clientSecret));
        } catch (err) {
          // do nothing
        }
      },

    }),
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/order/saveOrder`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result) {
            localStorage.removeItem("couponInfo");
            localStorage.removeItem("cart_products");
            localStorage.removeItem("shipping_info");
          }
        } catch (err) {
          // do nothing
        }
      },

    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/user-order`,
      providesTags:["UserOrders"],
      keepUnusedDataFor: 600,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `https://frozen-beach-97514-4e7308ffaf33.herokuapp.com/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
} = authApi;
