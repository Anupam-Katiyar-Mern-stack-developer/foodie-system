import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartGroups: [
    {
      restaurant: {
        slug: "spice-garden",
        restaurantName: "Spice Garden",
        isOpen: true,
      },

      items: [
        {
          slug: "classic-cheese-pizza",

          name: "Classic Cheese Pizza",

          image:
            "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=500&q=80",

          price: 299,

          discountPrice: 249,

          quantity: 2,

          isAvailable: true,
        },

        {
          slug: "veg-biryani",

          name: "Veg Biryani",

          image:
            "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80",

          price: 249,

          discountPrice: 219,

          quantity: 1,

          isAvailable: true,
        },
      ],
    },

    {
      restaurant: {
        slug: "urban-bites",
        restaurantName: "Urban Bites",
        isOpen: true,
      },

      items: [
        {
          slug: "crispy-chicken-burger",

          name: "Crispy Chicken Burger",

          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",

          price: 229,

          discountPrice: null,

          quantity: 1,

          isAvailable: true,
        },
      ],
    },
  ],

  fetchLoading: false,

  updatingSlug: null,

  deletingSlug: null,

  clearLoading: false,

  error: null,
};

const cartSlice = createSlice({
  name: "publicCart",

  initialState,

  reducers: {
    /*
        UI PHASE reducers.

        Backend integration ke time
        quantity/update/delete thunks
        use honge.
      */
    addCartItemLocal: (state, action) => {
      const { food, restaurant } = action.payload;

      // Invalid data
      if (!food || !restaurant) {
        return;
      }

      // Unavailable food cart me nahi jayega
      if (food.isAvailable === false) {
        return;
      }

      // =========================
      // RESTAURANT GROUP FIND
      // =========================

      let group = state.cartGroups.find(
        (item) => item.restaurant.slug === restaurant.slug,
      );

      // =========================
      // NEW RESTAURANT GROUP
      // =========================

      if (!group) {
        state.cartGroups.push({
          restaurant: {
            slug: restaurant.slug,

            restaurantName: restaurant.restaurantName,

            isOpen: restaurant.isOpen,
          },

          items: [],
        });

        group = state.cartGroups[state.cartGroups.length - 1];
      }

      // =========================
      // CHECK EXISTING FOOD
      // =========================

      const existingItem = group.items.find((item) => item.slug === food.slug);

      // Already cart me hai
      if (existingItem) {
        existingItem.quantity += 1;

        return;
      }

      // =========================
      // ADD NEW FOOD
      // =========================

      group.items.push({
        slug: food.slug,

        name: food.name,

        image: food.image,

        price: Number(food.price),

        discountPrice: food.discountPrice ? Number(food.discountPrice) : null,

        quantity: 1,

        isAvailable: food.isAvailable,
      });
    },

    updateCartQuantityLocal: (state, action) => {
      const { restaurantSlug, foodSlug, quantity } = action.payload;

      const group = state.cartGroups.find(
        (item) => item.restaurant.slug === restaurantSlug,
      );

      if (!group) {
        return;
      }

      const cartItem = group.items.find((item) => item.slug === foodSlug);

      if (!cartItem) {
        return;
      }

      if (quantity < 1) {
        return;
      }

      cartItem.quantity = quantity;
    },

    removeCartItemLocal: (state, action) => {
      const { restaurantSlug, foodSlug } = action.payload;

      const group = state.cartGroups.find(
        (item) => item.restaurant.slug === restaurantSlug,
      );

      if (!group) {
        return;
      }

      group.items = group.items.filter((item) => item.slug !== foodSlug);

      /*
          Restaurant ke andar
          koi item nahi bacha,
          group bhi remove.
        */

      state.cartGroups = state.cartGroups.filter(
        (item) => item.items.length > 0,
      );
    },

    clearCartLocal: (state) => {
      state.cartGroups = [];
    },
  },
});

export const {
  addCartItemLocal,
  updateCartQuantityLocal,
  removeCartItemLocal,
  clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
