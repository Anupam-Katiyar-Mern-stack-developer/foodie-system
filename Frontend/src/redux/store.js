import { configureStore } from "@reduxjs/toolkit";

import publicCategoryReducer from "./slices/public/category.slice";
import publicRestaurantReducer from "./slices/public/restaurant.slice";
import publicFoodReducer from "./slices/public/food.slice";
import publicCartReducer from "./slices/public/cart.slice";
import publicAddressReducer from "./slices/public/address.slice";
import publicProfileReducer from "./slices/public/profile.slice";
import publicOrderReducer from "./slices/public/order.slice";
import publicAuthReducer from "./slices/public/auth.slice";
import restaurantAuthReducer from "./slices/restaurant/restaurantAuth.slice";
import restaurantProfileReducer from "./slices/restaurant/restaurantProfile.slice";
import restaurantFoodReducer from "./slices/restaurant/restaurantFood.slice";
import restaurantOrderReducer from "./slices/restaurant/restaurantOrder.slice";
import restaurantDashboardReducer from "./slices/restaurant/restaurantDashboard.slice";

import deliveryAuthReducer from "./slices/deliveryAgent/deliveryAuth.slice";
import deliveryDashboardReducer from "./slices/deliveryAgent/deliveryDashboard.slice";
import deliveryOfferReducer from "./slices/deliveryAgent/deliveryOffer.slice";
import deliveryProfileReducer from "./slices/deliveryAgent/deliveryProfile.slice";

const store = configureStore({
  reducer: {
    publicCategory: publicCategoryReducer,

    publicRestaurant: publicRestaurantReducer,

    publicFood: publicFoodReducer,

    publicCart: publicCartReducer,

    publicAddress: publicAddressReducer,

    publicProfile: publicProfileReducer,

    publicOrder: publicOrderReducer,

    publicAuth: publicAuthReducer,

    restaurantAuth: restaurantAuthReducer,

    restaurantProfile: restaurantProfileReducer,
    restaurantFood: restaurantFoodReducer,
    restaurantOrder: restaurantOrderReducer,
    restaurantDashboard: restaurantDashboardReducer,

    deliveryAuth: deliveryAuthReducer,
    deliveryDashboard: deliveryDashboardReducer,
    deliveryOffer: deliveryOfferReducer,
    deliveryProfile: deliveryProfileReducer,
  },
});

export default store;
