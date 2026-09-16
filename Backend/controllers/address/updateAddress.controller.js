import { success } from "zod";
import {updateAddressService} from "../../services/address.service.js";

export const updateAddress =async(req , res ,next) =>{
    try{
        const userId =req.auth.userId;

        const {addressId} =req.params;

        const {
            label,
            addressLine,
            landmark,
            city,
            state,
            pincode,
            latitude,
            longitude,
            isDefault,
        }=req.body;

        const address =await updateAddressService({
            userId,
            addressId,
            label,
            addressLine,
            landmark,
            city,
            state,
            pincode,
            latitude,
            longitude,
            isDefault,
        });

        return res.status(200).json({
            success:true,
            message:"Address update successfully",
            data:address,
        });
    }catch(error){
        next (error);

    };
}