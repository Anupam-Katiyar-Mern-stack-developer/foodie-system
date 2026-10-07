import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";

import {
    STORAGE_KEYS,
} from "../constants/storageKeys";


const ProtectedRestaurantRoute = () => {
    const location =
        useLocation();


    const {
        isAuthenticated,
    } = useSelector(
        (state) =>
            state.restaurantAuth
    );


    const token =
        localStorage.getItem(
            STORAGE_KEYS.RESTAURANT_TOKEN
        );


    // =========================
    // NOT LOGGED IN
    // =========================

    if (
        !isAuthenticated ||
        !token
    ) {
        return (
            <Navigate
                to="/restaurant/login"

                replace

                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }


    return <Outlet />;
};


export default ProtectedRestaurantRoute;