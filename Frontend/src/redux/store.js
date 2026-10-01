import {
  configureStore,
} from "@reduxjs/toolkit";

import publicCategoryReducer from "./slices/public/category.slice";
import publicRestaurantReducer from "./slices/public/restaurant.slice";
import publicFoodReducer from "./slices/public/food.slice";


const store =
  configureStore({
    reducer: {
      publicCategory:
        publicCategoryReducer,

      publicRestaurant:
        publicRestaurantReducer,

      publicFood:
        publicFoodReducer,
    },
  });


export default store;