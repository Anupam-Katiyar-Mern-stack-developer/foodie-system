import toast from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(
    message || "Operation completed successfully"
  );
};

export const showErrorToast = (message) => {
  toast.error(
    message || "Something went wrong"
  );
};

export const showInfoToast = (message) => {
  toast(
    message || "Please wait..."
  );
};