import jwt from "jsonwebtoken";
import { success } from "zod";

export const adminAuthMiddleware=(
    req,res ,next
)=>{
    try{
        const authHeader = req.headers.authorization;

        if(
            !authHeader || !authHeader.startsWith("Bearer ")
        ){
            return res.status(401).json({
                success:false,
                message:"Admin authentication token is required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if(decoded.role !== "SUPER_ADMIN"){
            return res.status(403).json({
                success:false,
                message:"Admin access only",
            });
        }
        req.admin=decoded;
        next()
    }catch(error){
        return res.status(403).json({
            success:false,
            message:"Invalid or expired admin token",
        });
    }
}