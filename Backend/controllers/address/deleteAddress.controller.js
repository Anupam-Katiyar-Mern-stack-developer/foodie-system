import { success } from "zod";
import {deleteAddressService} from "../../services/address.service.js";

export const deleteAddress = async(req ,res , next)=>{
    try{
        const userId =req.auth.userId;
        const {addressId} =req.params;

        await deleteAddressService({
            userId,
            addressId,
        });
        return res.status(200).json({
            success:true,
            message:"Address deleted successfully",
        });
    }catch(error){
        next(error);
    }
} ;