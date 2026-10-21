import { z } from "zod";
import pool from "../config/database.js";
import { saveImage } from "../utils/storage/imageStorage.js";

export const defaultSiteSettings = {
  siteName: "Foodie", tagline: "Good food. Delivered with care.", logo: "", favicon: "",
  heroEyebrow: "Your neighbourhood. Your favourites.", heroTitle: "Good food,", heroHighlight: "great moments.",
  heroDescription: "Discover local favourites, find your next craving and let us bring something delicious to your door.",
  heroImage: "", heroButtonText: "Explore restaurants", announcement: "", announcementEnabled: false,
  supportEmail: "support@foodie.com", supportPhone: "", supportAddress: "", instagramUrl: "", facebookUrl: "",
  footerText: "A little closer to the food you love.", seoTitle: "Foodie | Your favourites, delivered", seoDescription: "Order fresh food from local restaurants on Foodie.",
  codEnabled: true, onlineEnabled: true, couponsEnabled: true, orderEmailsEnabled: true,
  maintenanceMode: false, maintenanceMessage: "We’re making things better. Please check back soon.",
  minimumOrder: 0, deliveryFee: 0, freeDeliveryAbove: 0, taxPercent: 0,
};
const image = z.string().max(2000).refine(value => !value || /^https?:\/\//i.test(value) || /^\/images\//.test(value), "Use an uploaded image or an HTTP(S) URL");
const link = z.string().max(2000).refine(value => !value || /^https?:\/\//i.test(value), "Use an HTTP(S) URL");
export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1).max(60), tagline: z.string().max(200), logo: image, favicon: image,
  heroEyebrow: z.string().max(120), heroTitle: z.string().min(1).max(100), heroHighlight: z.string().max(100),
  heroDescription: z.string().max(600), heroImage: image, heroButtonText: z.string().min(1).max(60),
  announcement: z.string().max(300), announcementEnabled: z.boolean(),
  supportEmail: z.union([z.literal(""), z.string().email()]), supportPhone: z.string().max(30), supportAddress: z.string().max(400),
  instagramUrl: link, facebookUrl: link, footerText: z.string().max(300), seoTitle: z.string().max(120), seoDescription: z.string().max(300),
  codEnabled: z.boolean(), onlineEnabled: z.boolean(), couponsEnabled: z.boolean(), orderEmailsEnabled: z.boolean(),
  maintenanceMode: z.boolean(), maintenanceMessage: z.string().max(400),
  minimumOrder: z.coerce.number().min(0).max(100000), deliveryFee: z.coerce.number().min(0).max(10000),
  freeDeliveryAbove: z.coerce.number().min(0).max(100000), taxPercent: z.coerce.number().min(0).max(100),
}).refine(value => value.codEnabled || value.onlineEnabled, "Keep at least one payment method enabled");

export const getSiteSettingsService = async (db = pool) => {
  const { rows } = await db.query("SELECT config, updated_at FROM site_settings WHERE id=1");
  return { ...defaultSiteSettings, ...rows[0]?.config };
};

export const saveSiteSettingsService = async (values, adminId) => {
  const parsed = siteSettingsSchema.safeParse(values);
  if (!parsed.success) throw Object.assign(new Error(parsed.error.issues.map(item => `${item.path.join('.')}: ${item.message}`).join('; ')), { statusCode: 400 });
  await pool.query(`INSERT INTO site_settings(id,config,updated_by) VALUES(1,$1,$2)
    ON CONFLICT(id) DO UPDATE SET config=EXCLUDED.config,updated_by=EXCLUDED.updated_by,updated_at=CURRENT_TIMESTAMP`, [parsed.data, adminId]);
  return parsed.data;
};

export const saveSiteAssetService = async (asset, file, adminId) => {
  if (!["logo", "favicon", "heroImage"].includes(asset) || !file) throw Object.assign(new Error("Choose a logo, favicon or hero image"), { statusCode: 400 });
  const url = await saveImage({ file, folder: "site" });
  await pool.query(`INSERT INTO site_settings(id,config,updated_by) VALUES(1,jsonb_build_object($1::text,$2::text),$3)
    ON CONFLICT(id) DO UPDATE SET config=site_settings.config || EXCLUDED.config, updated_by=$3,updated_at=CURRENT_TIMESTAMP`, [asset, url, adminId]);
  return { asset, url };
};

const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,40}$/), title: z.string().trim().min(2).max(120),
  description: z.string().max(1000).default(""), discountType: z.enum(["PERCENT","FIXED"]),
  discountValue: z.coerce.number().positive().max(100000), minOrder: z.coerce.number().min(0).default(0),
  maxDiscount: z.preprocess(value => value === "" || value == null ? null : Number(value), z.number().positive().nullable()),
  startsAt: z.preprocess(value => value || null, z.string().datetime({ offset: true }).nullable()),
  expiresAt: z.preprocess(value => value || null, z.string().datetime({ offset: true }).nullable()),
  usageLimit: z.preprocess(value => value === "" || value == null ? null : Number(value), z.number().int().positive().nullable()),
  perUserLimit: z.coerce.number().int().min(1).default(1), isActive: z.boolean().default(true),
}).refine(value => value.discountType !== "PERCENT" || value.discountValue <= 100, "Percentage cannot exceed 100")
  .refine(value => !value.startsAt || !value.expiresAt || new Date(value.startsAt) < new Date(value.expiresAt), "Expiry must be after start date");
const couponFields = `id,code,title,description,discount_type AS "discountType",discount_value AS "discountValue",min_order AS "minOrder",max_discount AS "maxDiscount",starts_at AS "startsAt",expires_at AS "expiresAt",usage_limit AS "usageLimit",per_user_limit AS "perUserLimit",is_active AS "isActive"`;
export const getCouponsService = async (publicOnly = false) => (await pool.query(`SELECT ${couponFields} FROM coupons ${publicOnly ? "WHERE is_active=TRUE AND (starts_at IS NULL OR starts_at<=NOW()) AND (expires_at IS NULL OR expires_at>NOW())" : ""} ORDER BY id DESC`)).rows;
export const saveCouponService = async (id, input) => {
  const result = couponSchema.safeParse(input);
  if (!result.success) throw Object.assign(new Error(result.error.issues.map(item => item.message).join('; ')), { statusCode: 400 });
  const c = result.data;
  const values = [c.code,c.title,c.description,c.discountType,c.discountValue,c.minOrder,c.maxDiscount,c.startsAt,c.expiresAt,c.usageLimit,c.perUserLimit,c.isActive];
  try {
    const saved = id ? await pool.query(`UPDATE coupons SET code=$1,title=$2,description=$3,discount_type=$4,discount_value=$5,min_order=$6,max_discount=$7,starts_at=$8,expires_at=$9,usage_limit=$10,per_user_limit=$11,is_active=$12,updated_at=NOW() WHERE id=$13 RETURNING ${couponFields}`, [...values,id])
      : await pool.query(`INSERT INTO coupons(code,title,description,discount_type,discount_value,min_order,max_discount,starts_at,expires_at,usage_limit,per_user_limit,is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING ${couponFields}`,values);
    if (!saved.rows[0]) throw Object.assign(new Error("Coupon not found"), { statusCode: 404 });
    return saved.rows[0];
  } catch (error) { if(error.code === "23505") throw Object.assign(new Error("Coupon code already exists"), { statusCode: 409 }); throw error; }
};

export const calculateCouponDiscount = async (db, code, userId, subtotal, lock = false) => {
  if (!code) return { discount: 0, coupon: null };
  const { rows } = await db.query(`SELECT * FROM coupons WHERE code=$1 ${lock ? "FOR UPDATE" : ""}`, [String(code).trim().toUpperCase()]);
  const c = rows[0];
  const fail = (text) => { throw Object.assign(new Error(text), { statusCode: 400 }); };
  if (!c || !c.is_active || (c.starts_at && new Date(c.starts_at) > new Date()) || (c.expires_at && new Date(c.expires_at) <= new Date())) fail("Coupon is unavailable or expired");
  if (subtotal < Number(c.min_order)) fail(`Minimum food subtotal for this coupon is ₹${c.min_order}`);
  const usage = await db.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER(WHERE user_id=$2)::int AS own FROM coupon_redemptions WHERE coupon_id=$1", [c.id,userId]);
  if ((c.usage_limit && usage.rows[0].total >= c.usage_limit) || usage.rows[0].own >= c.per_user_limit) fail("Coupon usage limit reached");
  let discount = c.discount_type === "PERCENT" ? subtotal * Number(c.discount_value) / 100 : Number(c.discount_value);
  if (c.max_discount != null) discount = Math.min(discount,Number(c.max_discount));
  discount = Math.min(discount,Math.max(0,subtotal - 1));
  if (discount <= 0) fail("Coupon cannot be applied to this order");
  return { discount: Math.round(discount * 100) / 100, coupon: c };
};

export const priceRestaurantGroups = (groups,settings,discount=0) => {
  const cents = value => Math.round(Number(value)*100);
  const foodCents=groups.reduce((sum,g)=>sum+cents(g.subtotal),0);
  const discountCents=cents(discount);
  let remaining=discountCents;
  const priced=groups.map((group,index)=>{
    const subtotal=cents(group.subtotal);
    const share=index===groups.length-1?remaining:Math.min(remaining,Math.floor(discountCents*subtotal/Math.max(1,foodCents)));
    remaining-=share;
    const deliveryFee=Number(settings.freeDeliveryAbove)>0&&foodCents>=cents(settings.freeDeliveryAbove)?0:cents(settings.deliveryFee);
    const tax=Math.round((subtotal-share)*Number(settings.taxPercent)/100);
    return {...group,discountAmount:share/100,deliveryFee:deliveryFee/100,taxAmount:tax/100,totalAmount:(subtotal-share+deliveryFee+tax)/100};
  });
  return {groups:priced,foodTotal:foodCents/100,discount:discountCents/100,deliveryFee:priced.reduce((sum,g)=>sum+cents(g.deliveryFee),0)/100,taxAmount:priced.reduce((sum,g)=>sum+cents(g.taxAmount),0)/100,grandTotal:priced.reduce((sum,g)=>sum+cents(g.totalAmount),0)/100};
};

export const getCheckoutQuoteService = async (userId,couponCode) => {
  const settings=await getSiteSettingsService();
  if(settings.maintenanceMode) throw Object.assign(new Error(settings.maintenanceMessage),{statusCode:503});
  const {rows}=await pool.query(`SELECT f.restaurant_id AS "restaurantId",SUM(COALESCE(f.discount_price,f.price)*ci.quantity) AS subtotal
    FROM carts ca JOIN cart_items ci ON ci.cart_id=ca.id JOIN foods f ON f.id=ci.food_id
    WHERE ca.user_id=$1 GROUP BY f.restaurant_id`,[userId]);
  const subtotal=rows.reduce((sum,row)=>sum+Number(row.subtotal),0);
  if(!rows.length) throw Object.assign(new Error("Your cart is empty"),{statusCode:400});
  if(couponCode&&!settings.couponsEnabled) throw Object.assign(new Error("Coupons are disabled"),{statusCode:400});
  const {discount}=await calculateCouponDiscount(pool,couponCode,userId,subtotal);
  return {...priceRestaurantGroups(rows,settings,discount),minimumOrder:settings.minimumOrder,couponCode:couponCode?String(couponCode).trim().toUpperCase():null};
};
