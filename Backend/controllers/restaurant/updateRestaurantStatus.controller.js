import { success } from "zod";
import {updateRestaurantStatusService } from "../../services/restaurant.service.js";

export const updateRestaurantStatus =async(
    req,
    res,
    next
) =>{
    try{
        const restaurantId = req.restaurant.restaurantId;

        const {isOpen} =req.body;

        if(typeof isOpen !=="boolean"){
            return res.stutus(400).json({
                success:false,
                message:"isOpen must be true or false",
            });
        }

        const restaurant = await updateRestaurantStatusService({
            restaurantId,
            isOpen,
        });

        return res.status(200).json({
            success:false,
            message:isOpen ? "Restaurant opened successfully"
                    :"Restaurant closed successfully",
            data:restaurant,        
        });
    }catch(error){
        next(error);
    }
}