import { createSlice } from "@reduxjs/toolkit";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../thunks/public/cart.thunk";

const initialState = {
  cartGroups: [],

  totalItems: 0,

  grandTotal: 0,

  fetchLoading: false,

  addLoadingSlug: null,

  updatingSlug: null,

  deletingSlug: null,

  clearLoading: false,

  error: null,
};

// =============================
// BACKEND → FRONTEND SHAPE
// =============================

const setCartData = (state, payload) => {
  const restaurants = payload?.restaurants ?? [];

  state.cartGroups = restaurants.map((restaurant) => ({
    restaurant: {
      slug: restaurant.restaurantSlug,

      restaurantName: restaurant.restaurantName,

      logo: restaurant.restaurantLogo,

      isOpen: restaurant.isOpen,

      subtotal: restaurant.subtotal,
    },

    items: restaurant.items ?? [],
  }));

  state.totalItems = payload?.totalItems ?? 0;

  state.grandTotal = payload?.grandTotal ?? 0;
};

const cartSlice = createSlice({
  name: "publicCart",

  initialState,

  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =====================
    // GET
    // =====================

    builder
      .addCase(getCart.pending, (state) => {
        state.fetchLoading = true;

        state.error = null;
      })

      .addCase(getCart.fulfilled, (state, action) => {
        state.fetchLoading = false;

        setCartData(state, action.payload);
      })

      .addCase(getCart.rejected, (state, action) => {
        state.fetchLoading = false;

        state.error = action.payload;
      });

    // =====================
    // ADD
    // =====================

    builder
      .addCase(addCartItem.pending, (state, action) => {
        state.addLoadingSlug = action.meta.arg?.foodSlug;

        state.error = null;
      })

      .addCase(addCartItem.fulfilled, (state, action) => {
        state.addLoadingSlug = null;

        setCartData(state, action.payload);
      })

      .addCase(addCartItem.rejected, (state, action) => {
        state.addLoadingSlug = null;

        state.error = action.payload;
      });

    // =====================
    // UPDATE
    // =====================

    builder
      .addCase(updateCartItem.pending, (state, action) => {
        state.updatingSlug = action.meta.arg?.foodSlug;

        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updatingSlug = null;

        setCartData(state, action.payload);
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.updatingSlug = null;

        state.error = action.payload;
      });

    // =====================
    // REMOVE
    // =====================

    builder
      .addCase(removeCartItem.pending, (state, action) => {
        state.deletingSlug = action.meta.arg;

        state.error = null;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.deletingSlug = null;

        setCartData(state, action.payload);
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.deletingSlug = null;

        state.error = action.payload;
      });

    // =====================
    // CLEAR
    // =====================

    builder
      .addCase(clearCart.pending, (state) => {
        state.clearLoading = true;

        state.error = null;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.clearLoading = false;

        setCartData(state, action.payload);
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.clearLoading = false;

        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
