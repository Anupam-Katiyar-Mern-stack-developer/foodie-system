export const PUBLIC_ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",

  PROFILE: "/profile",
  ADDRESSES: "/addresses",

  RESTAURANTS: "/restaurants",
  RESTAURANT_DETAILS: "/restaurants/:slug",

  CATEGORY_FOODS: "/categories/:slug",

  SEARCH: "/search",

  CART: "/cart",
  CHECKOUT: "/checkout",

  ORDERS: "/orders",
  ORDER_DETAILS: "/orders/:orderNumber",
};

export const RESTAURANT_ROUTES = {
  BASE: "/restaurant",

  LOGIN: "/restaurant/login",
  REGISTER: "/restaurant/register",

  DASHBOARD: "/restaurant/dashboard",

  PROFILE: "/restaurant/profile",

  FOODS: "/restaurant/foods",

  ADD_FOOD: "/restaurant/foods/add",

  EDIT_FOOD: "/restaurant/foods/:slug/edit",

  ORDERS: "/restaurant/orders",

  ORDER_DETAILS: "/restaurant/orders/:orderNumber",
};

export const DELIVERY_ROUTES = {
  BASE: "/delivery",

  LOGIN: "/delivery/login",
  REGISTER: "/delivery/register",

  DASHBOARD: "/delivery/dashboard",

  PROFILE: "/delivery/profile",

  OFFERS: "/delivery/offers",

  ACTIVE_DELIVERY: "/delivery/active",

  HISTORY: "/delivery/history",
};

export const ADMIN_ROUTES = {
  BASE: "/admin",

  LOGIN: "/admin/login",

  DASHBOARD: "/admin/dashboard",

  RESTAURANTS: "/admin/restaurants",

  DELIVERY_AGENTS: "/admin/delivery-agents",

  CATEGORIES: "/admin/categories",

  FOODS: "/admin/foods",

  ORDERS: "/admin/orders",

  SETTINGS: "/admin/settings",
};
