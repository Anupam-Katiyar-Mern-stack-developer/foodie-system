import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addCartItemService,
  clearCartService,
  getCartService,
  removeCartItemService,
  updateCartItemService,
} from "../../../services/public/cart.service";

import { getErrorMessage } from "../../../utils/getErrorMessage";

import { showErrorToast, showSuccessToast } from "../../../utils/toast";

// const getErrorMessage = (error) => {
//   return (
//     error?.response?.data?.message || error?.message || "Something went wrong"
//   );
// };

// =========================
// GET CART
// =========================

export const getCart = createAsyncThunk(
  "publicCart/getCart",

  async (_, { rejectWithValue }) => {
    try {
      return await getCartService();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// ADD ITEM
// =========================

export const addCartItem = createAsyncThunk(
  "publicCart/addCartItem",

  async (payload, { rejectWithValue }) => {
    try {
     const result= await addCartItemService(payload);

      showSuccessToast(result?.message || "Food added to cart");

      return await getCartService();
    } catch (error) {
      const message = getErrorMessage(error, "Unable to add food to cart");

      showErrorToast(message);
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// UPDATE QUANTITY
// =========================

export const updateCartItem = createAsyncThunk(
  "publicCart/updateCartItem",

  async (payload, { rejectWithValue }) => {
    try {
      await updateCartItemService(payload);

      return await getCartService();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// REMOVE ITEM
// =========================

export const removeCartItem = createAsyncThunk(
  "publicCart/removeCartItem",

  async (foodSlug, { rejectWithValue }) => {
    try {
      await removeCartItemService(foodSlug);

      return await getCartService();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// =========================
// CLEAR CART
// =========================

export const clearCart = createAsyncThunk(
  "publicCart/clearCart",

  async (_, { rejectWithValue }) => {
    try {
      await clearCartService();

      return {
        restaurants: [],
        totalItems: 0,
        grandTotal: 0,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
