import {registerRestaurantService} from "../../services/restaurant.service.js";

export const registerRestaurant =async(req , res ,next)=>{
    try{
        const {
            ownerName ,
            restaurantName,
            email,
            phone,
            password,
            description,
            addressLine,
            city,
            state,
            pincode,
            latitude,
            longitude,
        } =req.body;

        if(
            !ownerName || !restaurantName || !email || !phone || !password || !addressLine || !city || !state || !pincode
        ){
            return res.status(400).json({
                success:false,
                message:"Required resturant fields are missing",
            });
        }

        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Required restaurant fields are missing",
            });
        }

        const restaurant = await registerRestaurantService({
            ownerName,
            restaurantName,
            email,
            phone,
            password,
            description,
            addressLine,
            city,
            state,
            pincode,
            latitude,
            longitude,
        });

        return res.status(201).json({
            success:true,
            message:"Restaurant registered successfully and waiting for admin approval",
            data:restaurant,
        });
    }catch(error){
        next(error);
    }
};