import axios from "axios";

import {
  STORAGE_KEYS,
} from "../constants/storageKeys";


const apiClient =
  axios.create({
    baseURL:
      import.meta.env
        .VITE_API_BASE_URL,

    timeout: 15000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });


// =============================
// TOKEN BY REQUEST TYPE
// =============================

const getTokenForRequest = (
  url = ""
) => {
  if (
    url.startsWith(
      "/admin"
    )
  ) {
    return localStorage.getItem(
      STORAGE_KEYS.ADMIN_TOKEN
    );
  }


  if (
    url.startsWith(
      "/restaurant"
    )
  ) {
    return localStorage.getItem(
      STORAGE_KEYS.RESTAURANT_TOKEN
    );
  }


  if (
    url.startsWith(
      "/delivery"
    )
  ) {
    return localStorage.getItem(
      STORAGE_KEYS.DELIVERY_TOKEN
    );
  }


  /*
    User routes + authenticated
    customer routes.
  */

  return localStorage.getItem(
    STORAGE_KEYS.USER_TOKEN
  );
};


// =============================
// REQUEST INTERCEPTOR
// =============================

apiClient.interceptors.request.use(
  (config) => {
    const token =
      getTokenForRequest(
        config.url
      );


    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }


    return config;
  },

  (error) =>
    Promise.reject(error)
);


// =============================
// RESPONSE INTERCEPTOR
// =============================

apiClient.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    /*
      Abhi yahan redirect nahi
      karenge.

      Redux thunk decide karega
      401 par kya karna hai.

      Isse login redirect loops
      aur multi-role issues avoid
      honge.
    */

    return Promise.reject(
      error
    );
  }
);


export default apiClient;