import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: [
    {
      slug: "spice-garden",
      restaurantName: "Spice Garden",

      description:
        "Authentic Indian flavours prepared fresh with rich spices and traditional recipes.",

      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",

      addressLine: "Civil Lines",

      city: "Kanpur",

      state: "Uttar Pradesh",

      isOpen: true,
    },

    {
      slug: "urban-bites",

      restaurantName: "Urban Bites",

      description:
        "Modern comfort food, quick bites and delicious meals for every craving.",

      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",

      addressLine: "Swaroop Nagar",

      city: "Kanpur",

      state: "Uttar Pradesh",

      isOpen: true,
    },

    {
      slug: "royal-kitchen",

      restaurantName: "Royal Kitchen",

      description:
        "A premium dining experience with classic dishes, fresh ingredients and bold taste.",

      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",

      addressLine: "Kakadeo",

      city: "Kanpur",

      state: "Uttar Pradesh",

      isOpen: false,
    },
  ],

  fetchLoading: false,

  error: null,
};

const restaurantSlice = createSlice({
  name: "publicRestaurant",

  initialState,

  reducers: {},
});

export default restaurantSlice.reducer;
