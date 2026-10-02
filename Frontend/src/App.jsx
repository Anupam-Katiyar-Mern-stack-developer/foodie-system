import {
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import {
  bootstrapUserAuth,
} from "./redux/thunks/public/auth.thunk";


const App = () => {
  const dispatch =
    useDispatch();


  useEffect(() => {
    dispatch(
      bootstrapUserAuth()
    );
  }, [
    dispatch,
  ]);


  return (
    <AppRoutes />
  );
};


export default App;