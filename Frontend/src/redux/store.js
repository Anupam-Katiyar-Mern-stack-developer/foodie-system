import { configureStore } from "@reduxjs/toolkit";

import publicCategoryReducer from "./slices/public/category.slice";
import publicRestaurantReducer from "./slices/public/restaurant.slice";

const store = configureStore({
  reducer: {
    publicCategory: publicCategoryReducer,

    publicRestaurant: publicRestaurantReducer,
  },
});

export default store;
