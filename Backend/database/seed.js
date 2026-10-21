import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { IMAGE_ROOT } from "../utils/storage/imageStorage.js";

// Additive demo catalogue. Re-running never resets existing menus or passwords.
const image = (key) => `/images/catalogue/${key}.png`;
const categories = [
  ["pizza", "Pizza", "pizza"],
  ["burgers", "Burgers", "burger"],
  ["indian-meals", "Indian meals", "indian-meal"],
  ["combos", "Meal combos", "indian-meal"],
  ["desserts", "Desserts", "brownie"],
  ["coffee", "Coffee", "coffee"],
];
const restaurants = [
  [
    "oven-house",
    "The Oven House (Demo)",
    "pizza",
    "Swaroop Nagar",
    26.4736,
    80.3596,
  ],
  ["green-bun", "Green Bun (Demo)", "burger", "Arya Nagar", 26.4811, 80.3318],
  [
    "saffron-kitchen",
    "Saffron Kitchen (Demo)",
    "indian-meal",
    "Civil Lines",
    26.4743,
    80.3462,
  ],
  [
    "cocoa-coffee",
    "Cocoa & Coffee (Demo)",
    "brownie",
    "Tilak Nagar",
    26.4881,
    80.3256,
  ],
];
// restaurant, category, dish, price, discounted price, preparation minutes
const foods = [
  ["oven-house", "pizza", "Classic Margherita", 249, 219, 20],
  ["oven-house", "pizza", "Garden Fresh Pizza", 329, 289, 25],
  ["oven-house", "pizza", "Cheese & Corn Pizza", 299, null, 22],
  ["green-bun", "burgers", "Classic Veg Burger", 129, 109, 15],
  ["green-bun", "burgers", "Double Cheese Burger", 189, 169, 18],
  ["green-bun", "burgers", "Spicy Veg Burger", 159, null, 15],
  ["saffron-kitchen", "indian-meals", "Paneer Rice Bowl", 229, 199, 20],
  ["saffron-kitchen", "indian-meals", "Paneer & Naan Plate", 259, null, 25],
  ["saffron-kitchen", "indian-meals", "Classic Paneer Meal", 299, 269, 25],
  ["saffron-kitchen", "combos", "Lunch Comfort Combo", 349, 299, 25],
  ["saffron-kitchen", "combos", "Paneer Dinner Combo", 399, 349, 30],
  ["saffron-kitchen", "combos", "Family Paneer Feast", 699, 629, 35],
  ["cocoa-coffee", "desserts", "Fudgy Chocolate Brownie", 149, 129, 10],
  ["cocoa-coffee", "desserts", "Brownie Sundae", 199, null, 12],
  ["cocoa-coffee", "desserts", "Double Brownie Treat", 249, 219, 12],
  ["cocoa-coffee", "coffee", "Classic Cappuccino", 139, 119, 8],
  ["cocoa-coffee", "coffee", "Cafe Latte", 159, null, 8],
  ["cocoa-coffee", "coffee", "Rich Filter Coffee", 99, null, 8],
];
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const client = await pool.connect();
try {
  for (const key of ["pizza", "burger", "indian-meal", "brownie", "coffee"])
    await fs.access(path.join(IMAGE_ROOT, "catalogue", `${key}.png`));
  await client.query("BEGIN");
  await client.query(
    "SELECT pg_advisory_xact_lock(hashtext('foodie-demo-catalogue'))"
  );
  const ids = {},
    restaurantIds = {},
    created = { categories: 0, restaurants: 0, foods: 0, coupons: 0 };
  for (const [key, name, picture] of categories) {
    const inserted = await client.query(
      `INSERT INTO categories(name,slug,image,description,display_order) VALUES($1,$2,$3,$4,$5) ON CONFLICT(slug) DO NOTHING RETURNING id`,
      [
        name,
        key,
        image(picture),
        `Discover ${name.toLowerCase()} from local kitchens.`,
        categories.findIndex((c) => c[0] === key) + 1,
      ]
    );
    created.categories += inserted.rowCount;
    const row = (
      await client.query("SELECT id,image FROM categories WHERE slug=$1", [key])
    ).rows[0];
    ids[key] = row.id;
    let valid = false;
    if (typeof row.image === "string" && /^https?:\/\//.test(row.image))
      valid = true;
    else if (
      typeof row.image === "string" &&
      row.image.startsWith("/images/")
    ) {
      const resolved = path.resolve(
        IMAGE_ROOT,
        row.image.slice("/images/".length)
      );
      if (resolved.startsWith(`${IMAGE_ROOT}${path.sep}`)) {
        try {
          await fs.access(resolved);
          valid = true;
        } catch {}
      }
    }
    if (!valid)
      await client.query(
        "UPDATE categories SET image=$1,updated_at=NOW() WHERE id=$2",
        [image(picture), row.id]
      );
  }
  const password =
    process.env.DEMO_RESTAURANT_PASSWORD ||
    crypto.randomBytes(15).toString("base64url");
  const hash = await bcrypt.hash(password, 12);
  const accounts = [];
  for (const [
    index,
    [key, name, picture, area, lat, lng],
  ] of restaurants.entries()) {
    const email = `demo.${key}@example.test`;
    const inserted = await client.query(
      `INSERT INTO restaurants(owner_name,restaurant_name,slug,email,phone,password,description,logo,address_line,city,state,pincode,latitude,longitude,opening_time,closing_time,is_open,approval_status,email_verified)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'Kanpur','Uttar Pradesh','208002',$10,$11,'09:00','23:00',TRUE,'APPROVED',FALSE) ON CONFLICT(slug) DO NOTHING RETURNING id`,
      [
        "Demo partner",
        name,
        `demo-${key}-kanpur`,
        email,
        `90000001${String(index + 1).padStart(2, "0")}`,
        hash,
        "Sample restaurant for development and flow testing. Replace with your own restaurant information before launch.",
        image(picture),
        `${index + 10}, ${area} (demo address)`,
        lat,
        lng,
      ]
    );
    created.restaurants += inserted.rowCount;
    restaurantIds[key] = (
      await client.query("SELECT id FROM restaurants WHERE slug=$1", [
        `demo-${key}-kanpur`,
      ])
    ).rows[0].id;
    if (inserted.rowCount) accounts.push({ email, password });
  }
  for (const [restaurant, category, name, price, discount, minutes] of foods) {
    const picture = categories.find((c) => c[0] === category)[2];
    const result = await client.query(
      `INSERT INTO foods(restaurant_id,category_id,name,slug,description,price,discount_price,image,is_veg,is_available,preparation_time) VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,TRUE,$9) ON CONFLICT(slug) DO NOTHING`,
      [
        restaurantIds[restaurant],
        ids[category],
        name,
        `demo-${restaurant}-${slug(name)}`,
        `${name}, freshly prepared by our sample kitchen. Representative menu photography.`,
        price,
        discount,
        image(picture),
        minutes,
      ]
    );
    created.foods += result.rowCount;
  }
  for (const [code, title, type, value, min, max] of [
    ["DEMO10", "A little welcome treat", "PERCENT", 10, 199, 100],
    ["MEAL50", "More good food, less to pay", "FIXED", 50, 399, null],
  ]) {
    const result = await client.query(
      `INSERT INTO coupons(code,title,description,discount_type,discount_value,min_order,max_discount,expires_at,usage_limit,per_user_limit,is_active) VALUES($1,$2,'Sample catalogue offer. Apply at checkout.',$3,$4,$5,$6,NOW()+INTERVAL '30 days',100,1,TRUE) ON CONFLICT(code) DO NOTHING`,
      [code, title, type, value, min, max]
    );
    created.coupons += result.rowCount;
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ created, accounts }, null, 2));
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Demo seed failed:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
