import { configureStore } from "@reduxjs/toolkit";

import publicCategoryReducer from "./slices/public/category.slice";

const store = configureStore({
  reducer: {
    publicCategory: publicCategoryReducer,
  },
});

export default store;
