import { success } from "zod";
import { registerUserService } from "../../services/auth.service.js";

export const registerUser = async(req,res,next)=>{
    try{
        const {name , email , phone , password }= req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Name email and password are required",
            });

        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters",
            });
        }

         const user = await registerUserService({
                name,
                email,
                phone ,
                 password,

            });

            return res.status(201).json({
                success:true,
                message:"User registered successfully",
                data:user,
            });
    }catch(error){
        next (error);
    }
}