import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    {
      slug: "pizza",
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=500&q=80",
    },

    {
      slug: "burger",
      name: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    },

    {
      slug: "biryani",
      name: "Biryani",
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80",
    },

    {
      slug: "chinese",
      name: "Chinese",
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80",
    },

    {
      slug: "desserts",
      name: "Desserts",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80",
    },

    {
      slug: "south-indian",
      name: "South Indian",
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80",
    },
  ],

  fetchLoading: false,

  error: null,
};

const categorySlice = createSlice({
  name: "publicCategory",

  initialState,

  reducers: {},
});

export default categorySlice.reducer;
