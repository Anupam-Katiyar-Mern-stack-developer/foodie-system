import { success } from "zod";
import { getPendingRestaurantsService} from "../../services/admin.service.js";

export const getPendingRestaurants =async(
    req , res , next
)=>{
    try{
        const restaurants = await getPendingRestaurantsService();

        return res.status(200).json({
            success:true,
            message:"Pending restaurants fetched successfully",
            data:restaurants,
        });
    }catch(error){
        next(error);
    }
}