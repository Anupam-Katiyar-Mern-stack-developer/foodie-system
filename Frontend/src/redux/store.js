import { configureStore } from "@reduxjs/toolkit";

import publicCategoryReducer from "./slices/public/category.slice";
import publicRestaurantReducer from "./slices/public/restaurant.slice";
import publicFoodReducer from "./slices/public/food.slice";
import publicCartReducer from "./slices/public/cart.slice";
import publicAddressReducer from "./slices/public/address.slice";

const store = configureStore({
  reducer: {
    publicCategory: publicCategoryReducer,

    publicRestaurant: publicRestaurantReducer,

    publicFood: publicFoodReducer,

    publicCart: publicCartReducer,

    publicAddress: publicAddressReducer,
  },
});

export default store;
