import { success } from "zod";
import {
  updateCategoryStatusService,
} from "../../services/category.service.js";


export const updateCategoryStatus =async(
    req , res , next
)=>{
    try{
        const {categorySlug} =req.params;
        const {isActive} =req.body;

        if(typeof isActive !== "boolean"){
            return res.status(400).json({
                success:false,
                message:"isActive must be true or false",
            });
        }

        const category = await updateCategoryStatusService({
            categorySlug,
            isActive,
        });

        return res.status(200).json({
            success:true,
             message: isActive
        ? "Category activated successfully"
        : "Category deactivated successfully",
            data:category,
        });
    }catch(error){
        next(error);
    }
}