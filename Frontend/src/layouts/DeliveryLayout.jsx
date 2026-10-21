import {
    useState,
} from "react";

import {
    Outlet,
} from "react-router-dom";

import DeliverySidebar
    from "../components/deliveryAgent/DeliverySidebar";

import DeliveryNavbar
    from "../components/deliveryAgent/DeliveryNavbar";

import DeliveryRealtime from "../components/deliveryAgent/DeliveryRealtime";
const DeliveryLayout = () => {

    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(false);



    return (

        <div
            className="
        min-h-screen

        bg-[#fffaf5]
      "
        >
            <DeliveryRealtime />

            <DeliverySidebar
                mobileOpen={
                    sidebarOpen
                }

                onClose={() =>
                    setSidebarOpen(
                        false
                    )
                }
            />


            <div
                className="
          min-h-screen

          lg:pl-[280px]
        "
            >

                <DeliveryNavbar
                    onMenuOpen={() =>
                        setSidebarOpen(
                            true
                        )
                    }
                />


                <main className="p-4

            sm:p-6
            lg:p-8
          "
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

};


export default DeliveryLayout;