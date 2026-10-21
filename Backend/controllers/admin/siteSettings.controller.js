import { getSiteSettingsService, saveSiteSettingsService, saveSiteAssetService, getCouponsService, saveCouponService } from "../../services/setting.service.js";

export const getSiteSettings = async (req,res,next) => { try { res.json({success:true,data:await getSiteSettingsService()}); } catch(error){next(error);} };
export const saveSiteSettings = async (req,res,next) => { try { res.json({success:true,message:"Site settings saved",data:await saveSiteSettingsService(req.body,req.admin.adminId)}); } catch(error){next(error);} };
export const saveSiteAsset = async (req,res,next) => { try { res.json({success:true,data:await saveSiteAssetService(req.query.asset,req.file,req.admin.adminId)}); } catch(error){next(error);} };
export const getCoupons = async (req,res,next) => { try { res.json({success:true,data:await getCouponsService(!req.admin)}); } catch(error){next(error);} };
export const saveCoupon = async (req,res,next) => { try { res.json({success:true,message:"Coupon saved",data:await saveCouponService(req.params.id,req.body)}); } catch(error){next(error);} };
