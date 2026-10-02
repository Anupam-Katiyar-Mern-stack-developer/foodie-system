import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      orderNumber: "FD-20261002-001",

      restaurantSlug: "spice-garden",

      restaurantName: "Spice Garden",

      status: "OUT_FOR_DELIVERY",

      total: 717,

      createdAt: "2026-10-02T09:45:00",

      items: [
        {
          name: "Classic Cheese Pizza",

          quantity: 2,
        },

        {
          name: "Veg Biryani",

          quantity: 1,
        },
      ],
    },

    {
      orderNumber: "FD-20261001-002",

      restaurantSlug: "urban-bites",

      restaurantName: "Urban Bites",

      status: "DELIVERED",

      total: 508,

      createdAt: "2026-10-01T18:20:00",

      items: [
        {
          name: "Crispy Chicken Burger",

          quantity: 1,
        },

        {
          name: "Creamy Pasta",

          quantity: 1,
        },
      ],
    },

    {
      orderNumber: "FD-20260930-003",

      restaurantSlug: "spice-garden",

      restaurantName: "Spice Garden",

      status: "PREPARING",

      total: 249,

      createdAt: "2026-09-30T20:10:00",

      items: [
        {
          name: "Classic Cheese Pizza",

          quantity: 1,
        },
      ],
    },
  ],

  selectedOrder: null,

  fetchLoading: false,

  detailLoading: false,

  placeOrderLoading: false,

  error: null,

  detailError: null,
};

const orderSlice = createSlice({
  name: "publicOrder",

  initialState,

  reducers: {},
});

export default orderSlice.reducer;
