import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getRestaurants,
  getRestaurantBySlug,
} from "../../thunks/public/restaurant.thunk";


const initialState = {
  // =========================
  // RESTAURANT LIST
  // =========================

  restaurants: [],

  fetchLoading: false,

  error: null,

  pagination: null,


  // =========================
  // RESTAURANT DETAIL
  // =========================

  selectedRestaurant: null,

  detailLoading: false,

  detailError: null,
};


const restaurantSlice =
  createSlice({
    name: "publicRestaurant",

    initialState,

    reducers: {
      clearSelectedRestaurant:
        (state) => {
          state.selectedRestaurant =
            null;

          state.detailError =
            null;
        },

      clearRestaurantError:
        (state) => {
          state.error =
            null;

          state.detailError =
            null;
        },
    },


    extraReducers: (
      builder
    ) => {

      // =========================
      // GET RESTAURANTS
      // =========================

      builder
        .addCase(
          getRestaurants.pending,

          (state) => {
            state.fetchLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          getRestaurants.fulfilled,

          (
            state,
            action
          ) => {
            state.fetchLoading =
              false;


            /*
              Handles responses like:

              data: {
                restaurants: [],
                pagination: {}
              }

              OR directly:
              []
            */

            state.restaurants =
              action.payload
                ?.restaurants ??
              action.payload
                ?.items ??
              (
                Array.isArray(
                  action.payload
                )
                  ? action.payload
                  : []
              );


            state.pagination =
              action.payload
                ?.pagination ??
              null;
          }
        )

        .addCase(
          getRestaurants.rejected,

          (
            state,
            action
          ) => {
            state.fetchLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load restaurants";
          }
        );


      // =========================
      // GET RESTAURANT DETAIL
      // =========================

      builder
        .addCase(
          getRestaurantBySlug
            .pending,

          (state) => {
            state.detailLoading =
              true;

            state.detailError =
              null;

            state.selectedRestaurant =
              null;
          }
        )

        .addCase(
          getRestaurantBySlug
            .fulfilled,

          (
            state,
            action
          ) => {
            state.detailLoading =
              false;


            /*
              Handles:

              data: {
                restaurant: {...}
              }

              OR directly:
              {...}
            */

            state.selectedRestaurant =
              action.payload
                ?.restaurant ??
              action.payload ??
              null;
          }
        )

        .addCase(
          getRestaurantBySlug
            .rejected,

          (
            state,
            action
          ) => {
            state.detailLoading =
              false;

            state.detailError =
              action.payload ||
              "Unable to load restaurant";

            state.selectedRestaurant =
              null;
          }
        );
    },
  });


export const {
  clearSelectedRestaurant,
  clearRestaurantError,
} =
  restaurantSlice.actions;


export default
restaurantSlice.reducer;