import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateRestaurantLocationService } from "../../../services/restaurant/restaurantLocation.service";

const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },

      (error) => {
        reject(new Error(error.message || "Unable to get restaurant location"));
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  });
};

export const syncRestaurantLocation = createAsyncThunk(
  "restaurantLocation/syncRestaurantLocation",

  async (_, { rejectWithValue }) => {
    try {
      const location = await getBrowserLocation();

      const response = await updateRestaurantLocationService(location);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update restaurant location",
      );
    }
  },
);
