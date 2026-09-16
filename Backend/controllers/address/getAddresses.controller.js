import { success } from "zod";
import {getAddressesService} from "../../services/address.service.js";

export const getAddresses = async(req ,res,next) =>{
    try{
        const userId = req.auth.userId;

        const addresses = await getAddressesService(userId);

        return res.status(200).json({
            success:true,
            message:"Addresses fetched successfully",
            data:addresses,
        });

    }catch(error){
        next(error);

    }
};
