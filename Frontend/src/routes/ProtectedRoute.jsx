import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";


const ProtectedRoute = () => {
    const location =
        useLocation();


    const {
        isAuthenticated,
    } = useSelector(
        (state) =>
            state.publicAuth
    );


    // =========================
    // NOT LOGGED IN
    // =========================

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"

                replace

                state={{
                    from:
                        location.pathname +
                        location.search,
                }}
            />
        );
    }


    // =========================
    // LOGGED IN
    // =========================

    return <Outlet />;
};


export default ProtectedRoute;