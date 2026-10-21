import { useEffect } from "react";

import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import { bootstrapUserAuth } from "./redux/thunks/public/auth.thunk";

import { Toaster } from "react-hot-toast";
import { fetchSiteSettings } from "./redux/thunks/public/setting.thunk";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSiteSettings());
    const refreshSettings = () => dispatch(fetchSiteSettings());
    window.addEventListener("focus", refreshSettings);
    dispatch(bootstrapUserAuth());
    return () => window.removeEventListener("focus", refreshSettings);
  }, [dispatch]);

  return (
    <>
      <AppRoutes />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,

          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
          },

          success: {
            duration: 3000,
          },

          error: {
            duration: 4000,
          },
        }}
      />
    </>
  );
};

export default App;
