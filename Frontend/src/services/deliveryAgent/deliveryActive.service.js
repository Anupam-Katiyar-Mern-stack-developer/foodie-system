import apiClient from "../../api/apiClient";

export const getActiveOrdersService =async()=>{
    const response = await apiClient("/delivery/active/orders");
    return response.data;
}