import {
  createSlice,
} from "@reduxjs/toolkit";


const initialState = {
  foods: [
    {
      slug: "classic-cheese-pizza",

      restaurantSlug:
        "spice-garden",

      categorySlug:
        "pizza",

      categoryName:
        "Pizza",

      name:
        "Classic Cheese Pizza",

      description:
        "Loaded with cheese, rich tomato sauce and fresh herbs.",

      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",

      price: 299,

      discountPrice: 249,

      preparationTime: 25,

      isVeg: true,

      isAvailable: true,
    },

    {
      slug:
        "veg-biryani",

      restaurantSlug:
        "spice-garden",

      categorySlug:
        "biryani",

      categoryName:
        "Biryani",

      name:
        "Veg Biryani",

      description:
        "Fragrant basmati rice cooked with vegetables and aromatic spices.",

      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",

      price: 249,

      discountPrice: 219,

      preparationTime: 30,

      isVeg: true,

      isAvailable: true,
    },

    {
      slug:
        "crispy-chicken-burger",

      restaurantSlug:
        "urban-bites",

      categorySlug:
        "burger",

      categoryName:
        "Burger",

      name:
        "Crispy Chicken Burger",

      description:
        "Crispy chicken, fresh veggies and creamy sauce in a soft bun.",

      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",

      price: 229,

      discountPrice: null,

      preparationTime: 20,

      isVeg: false,

      isAvailable: true,
    },

    {
      slug:
        "creamy-pasta",

      restaurantSlug:
        "urban-bites",

      categorySlug:
        "pasta",

      categoryName:
        "Pasta",

      name:
        "Creamy Pasta",

      description:
        "Creamy sauce, herbs and perfectly cooked pasta for a comforting meal.",

      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",

      price: 279,

      discountPrice: null,

      preparationTime: 20,

      isVeg: true,

      isAvailable: true,
    },
  ],


  fetchLoading: false,

  restaurantFoodsLoading:
    false,

  error: null,
};


const foodSlice =
  createSlice({
    name: "publicFood",

    initialState,

    reducers: {},
  });


export default foodSlice.reducer;