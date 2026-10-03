import {
    useState,
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    FaMapMarkerAlt,
    FaPlus,
} from "react-icons/fa";

import Container from "../../../components/common/Container/Container";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import Modal from "../../../components/common/Modal/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import Button from "../../../components/common/Button/Button";

import AddressCard from "../../../components/public/AddressCard/AddressCard";

import {
    createAddress,
    deleteAddress,
    getAddresses,
    setDefaultAddress,
    updateAddress,
} from "../../../redux/thunks/public/address.thunk";

import {
    addressSchema,
} from "../../../validations/public/address.validation";

import {
    addressFields,
    addressDefaultValues,
} from "../../../forms/public/address.form";


const Addresses = () => {

    const dispatch =
        useDispatch();

    // =========================
    // REDUX
    // =========================

    const {
        addresses,

        fetchLoading,
        createLoading,
        updateLoading,

        deletingId,
        defaultLoadingId,

        error,
    } = useSelector(
        (state) =>
            state.publicAddress
    );


    useEffect(() => {
        dispatch(
            getAddresses()
        );
    }, [dispatch]);

    // =========================
    // LOCAL UI STATE
    // =========================

    const [
        formOpen,
        setFormOpen,
    ] = useState(false);


    const [
        editingAddress,
        setEditingAddress,
    ] = useState(null);


    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);


    // =========================
    // ADD
    // =========================

    const openAddForm = () => {
        setEditingAddress(null);

        setFormOpen(true);
    };


    // =========================
    // EDIT
    // =========================

    const openEditForm = (
        address
    ) => {
        setEditingAddress(
            address
        );

        setFormOpen(true);
    };


    // =========================
    // CLOSE
    // =========================

    const closeForm = () => {
        setFormOpen(false);

        setEditingAddress(null);
    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit =
        async (values) => {
            console.log(
                "ADDRESS PAYLOAD:",
                values
            );

            try {
                if (editingAddress) {
                    await dispatch(
                        updateAddress({
                            addressId:
                                editingAddress.id,

                            payload: values,
                        })
                    ).unwrap();
                } else {
                    await dispatch(
                        createAddress(
                            values
                        )
                    ).unwrap();
                }

                closeForm();
            } catch (error) {
                console.error(
                    "ADDRESS SUBMIT ERROR:",
                    error
                );
            }
        };


    // =========================
    // DELETE
    // =========================

    const handleDeleteConfirm =
        async () => {
            if (!deleteTarget) {
                return;
            }

            try {
                await dispatch(
                    deleteAddress(
                        deleteTarget.id
                    )
                ).unwrap();

                setDeleteTarget(null);
            } catch (error) {
                console.error(
                    "DELETE ADDRESS ERROR:",
                    error
                );
            }
        };


    // =========================
    // DEFAULT
    // =========================

    const handleSetDefault =
        async (id) => {
            try {
                await dispatch(
                    setDefaultAddress(id)
                ).unwrap();
            } catch (error) {
                console.error(
                    "SET DEFAULT ERROR:",
                    error
                );
            }
        };


    // =========================
    // FORM DEFAULT VALUES
    // =========================

    const formValues =
        editingAddress
            ? {
                label:
                    editingAddress.label ||
                    "Home",

                addressLine:
                    editingAddress.addressLine ||
                    "",

                landmark:
                    editingAddress.landmark ||
                    "",

                city:
                    editingAddress.city ||
                    "",

                state:
                    editingAddress.state ||
                    "",

                pincode:
                    editingAddress.pincode ||
                    "",
            }
            : addressDefaultValues;


    return (
        <div
            className="
        min-h-screen

        bg-[#fffaf5]
      "
        >
            {/* =========================
          HEADER
      ========================== */}

            <section
                className="
          relative
          overflow-hidden

          border-b
          border-orange-100

          bg-white
        "
            >
                <div
                    className="
            pointer-events-none

            absolute
            -left-24
            top-0

            h-60
            w-60

            rounded-full

            bg-orange-300/15

            blur-[90px]
          "
                />


                <Container>
                    <div
                        className="
              relative
              z-10

              flex
              flex-col
              gap-5

              py-10

              sm:flex-row
              sm:items-end
              sm:justify-between

              lg:py-14
            "
                    >
                        <div
                            className="
                max-w-2xl
              "
                        >
                            <div
                                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-orange-200

                  bg-orange-50

                  px-3
                  py-1.5

                  text-xs
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-orange-600
                "
                            >
                                <FaMapMarkerAlt />

                                Delivery locations
                            </div>


                            <h1
                                className="
                  mt-4

                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950

                  sm:text-4xl
                "
                            >
                                Saved
                                <span
                                    className="
                    text-orange-500
                  "
                                >
                                    {" "}
                                    addresses
                                </span>
                            </h1>


                            <p
                                className="
                  mt-2

                  text-sm
                  leading-6
                  text-slate-500

                  sm:text-base
                "
                            >
                                Manage where Foodie
                                should deliver your
                                orders.
                            </p>
                        </div>


                        <Button
                            type="button"

                            onClick={
                                openAddForm
                            }

                            leftIcon={
                                FaPlus
                            }
                        >
                            Add Address
                        </Button>
                    </div>
                </Container>
            </section>


            {/* =========================
          CONTENT
      ========================== */}

            <section
                className="
          py-8

          sm:py-10

          lg:py-12
        "
            >
                <Container>
                    {/* LOADING */}

                    {fetchLoading && (
                        <div
                            className="
                grid
                gap-5

                md:grid-cols-2
              "
                        >
                            {Array.from({
                                length: 4,
                            }).map(
                                (_, index) => (
                                    <Skeleton
                                        key={index}

                                        width="w-full"
                                        height="h-[230px]"
                                        rounded="rounded-[1.6rem]"
                                    />
                                )
                            )}
                        </div>
                    )}


                    {/* ERROR */}

                    {!fetchLoading &&
                        error && (
                            <ErrorState
                                title="Unable to load addresses"

                                description={
                                    typeof error ===
                                        "string"
                                        ? error
                                        : "Something went wrong while loading your addresses."
                                }
                            />
                        )}


                    {/* EMPTY */}

                    {!fetchLoading &&
                        !error &&
                        addresses.length ===
                        0 && (
                            <EmptyState
                                icon={
                                    FaMapMarkerAlt
                                }

                                title="No saved addresses"

                                description="Add a delivery address so you can checkout faster."

                                action={
                                    <Button
                                        type="button"

                                        onClick={
                                            openAddForm
                                        }

                                        leftIcon={
                                            FaPlus
                                        }
                                    >
                                        Add Address
                                    </Button>
                                }
                            />
                        )}


                    {/* ADDRESS GRID */}

                    {!fetchLoading &&
                        !error &&
                        addresses.length >
                        0 && (
                            <div
                                className="
                  grid
                  gap-5

                  md:grid-cols-2
                "
                            >
                                {addresses.map(
                                    (address) => (
                                        <AddressCard
                                            key={
                                                address.id
                                            }

                                            address={
                                                address
                                            }

                                            deleting={
                                                deletingId ===
                                                address.id
                                            }

                                            defaultLoading={
                                                defaultLoadingId ===
                                                address.id
                                            }

                                            onEdit={() =>
                                                openEditForm(
                                                    address
                                                )
                                            }

                                            onDelete={() =>
                                                setDeleteTarget(
                                                    address
                                                )
                                            }

                                            onSetDefault={() =>
                                                handleSetDefault(
                                                    address.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                </Container>
            </section>


            {/* =========================
          ADD / EDIT MODAL
      ========================== */}

            <Modal
                open={formOpen}

                onClose={
                    closeForm
                }

                title={
                    editingAddress
                        ? "Edit Address"
                        : "Add New Address"
                }

                description={
                    editingAddress
                        ? "Update your saved delivery address."
                        : "Enter the address where you want your order delivered."
                }
            >
                <CommonForm
                    key={
                        editingAddress?.id ||
                        "new-address"
                    }

                    fields={
                        addressFields
                    }

                    schema={
                        addressSchema
                    }

                    defaultValues={
                        formValues
                    }

                    onSubmit={
                        handleSubmit
                    }

                    onCancel={
                        closeForm
                    }

                    loading={
                        editingAddress
                            ? updateLoading
                            : createLoading
                    }

                    submitText={
                        editingAddress
                            ? "Update Address"
                            : "Save Address"
                    }

                    columns={2}
                />
            </Modal>


            {/* =========================
          DELETE CONFIRM
      ========================== */}

            <ConfirmModal
                open={
                    Boolean(
                        deleteTarget
                    )
                }

                onClose={() =>
                    setDeleteTarget(null)
                }

                title="Delete address?"

                description="This saved delivery address will be permanently removed."

                confirmText="Delete Address"

                loading={
                    deletingId ===
                    deleteTarget?.id
                }

                onConfirm={
                    handleDeleteConfirm
                }

                variant="danger"
            />
        </div>
    );
};


export default Addresses;