import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [
    {
      id: 1,

      addressLine: "117/K/12, Kakadeo",

      city: "Kanpur",

      state: "Uttar Pradesh",

      pincode: "208025",

      isDefault: true,
    },

    {
      id: 2,

      addressLine: "Near Gumti No. 5",

      city: "Kanpur",

      state: "Uttar Pradesh",

      pincode: "208012",

      isDefault: false,
    },
  ],

  fetchLoading: false,

  error: null,
};

const addressSlice = createSlice({
  name: "publicAddress",

  initialState,

  reducers: {},
});

export default addressSlice.reducer;
