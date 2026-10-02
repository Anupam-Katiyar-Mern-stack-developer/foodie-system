import {
  createSlice,
} from "@reduxjs/toolkit";


const initialState = {
  addresses: [
    {
      id: 1,

      addressLine:
        "117/K/12, Kakadeo",

      city:
        "Kanpur",

      state:
        "Uttar Pradesh",

      pincode:
        "208025",

      isDefault:
        true,
    },

    {
      id: 2,

      addressLine:
        "Near Gumti No. 5",

      city:
        "Kanpur",

      state:
        "Uttar Pradesh",

      pincode:
        "208012",

      isDefault:
        false,
    },
  ],


  fetchLoading: false,

  createLoading: false,

  updateLoading: false,

  deletingId: null,

  defaultLoadingId: null,

  error: null,
};


const addressSlice =
  createSlice({
    name: "publicAddress",

    initialState,

    reducers: {
      // =========================
      // ADD
      // =========================

      addAddressLocal: (
        state,
        action
      ) => {
        const nextId =
          state.addresses.length
            ? Math.max(
                ...state.addresses.map(
                  (address) =>
                    Number(
                      address.id
                    )
                )
              ) + 1
            : 1;


        const firstAddress =
          state.addresses.length ===
          0;


        state.addresses.push({
          id: nextId,

          ...action.payload,

          isDefault:
            firstAddress,
        });
      },


      // =========================
      // UPDATE
      // =========================

      updateAddressLocal: (
        state,
        action
      ) => {
        const {
          id,
          data,
        } = action.payload;


        const address =
          state.addresses.find(
            (item) =>
              item.id === id
          );


        if (!address) {
          return;
        }


        address.addressLine =
          data.addressLine;

        address.city =
          data.city;

        address.state =
          data.state;

        address.pincode =
          data.pincode;
      },


      // =========================
      // DELETE
      // =========================

      deleteAddressLocal: (
        state,
        action
      ) => {
        const id =
          action.payload;


        const deletedAddress =
          state.addresses.find(
            (address) =>
              address.id === id
          );


        state.addresses =
          state.addresses.filter(
            (address) =>
              address.id !== id
          );


        /*
          Default delete hua aur
          addresses bache hue hain
          to first ko default.
        */

        if (
          deletedAddress?.isDefault &&
          state.addresses.length >
            0
        ) {
          state.addresses[0]
            .isDefault = true;
        }
      },


      // =========================
      // DEFAULT ADDRESS
      // =========================

      setDefaultAddressLocal: (
        state,
        action
      ) => {
        const id =
          action.payload;


        state.addresses.forEach(
          (address) => {
            address.isDefault =
              address.id === id;
          }
        );
      },
    },
  });


export const {
  addAddressLocal,
  updateAddressLocal,
  deleteAddressLocal,
  setDefaultAddressLocal,
} = addressSlice.actions;


export default addressSlice.reducer;