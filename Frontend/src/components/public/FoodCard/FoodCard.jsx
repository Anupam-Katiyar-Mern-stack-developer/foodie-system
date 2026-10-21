import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock3, LoaderCircle, ArrowUpRight } from "lucide-react";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
export default function FoodCard({ food, onAddToCart }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  if (!food) return null;
  const {
    slug,
    name,
    description,
    image,
    price,
    discountPrice,
    preparationTime,
    isVeg,
  } = food;
  const discounted =
    discountPrice != null && Number(discountPrice) < Number(price);
  const unavailable =
    food.isAvailable === false || food.restaurantIsOpen === false;
  const add = async () => {
    if (adding || unavailable) return;
    setAdding(true);
    setError("");
    try {
      await onAddToCart(food);
    } catch (e) {
      setError(
        typeof e === "string"
          ? e
          : e.message || "Unable to add this item. Please retry."
      );
    } finally {
      setAdding(false);
    }
  };
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#e6e6dd] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#c6cfb9] hover:shadow-lg hover:shadow-[#434d2e]/5">
      <Link
        to={`/foods/${slug}`}
        aria-label={`View ${name}`}
        className="relative block overflow-hidden bg-[#eeeee6]"
      >
        <OptimizedImage
          src={image}
          alt={name}
          aspectRatio="aspect-[4/3]"
          rounded="rounded-none"
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
        {discounted && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf0] px-3 py-1.5 text-[11px] font-bold text-[#7d582f]">
            {Math.round((1 - Number(discountPrice) / Number(price)) * 100)}% off
          </span>
        )}
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-950/85 px-3 py-1.5 text-[10px] font-semibold text-white">
            {food.restaurantIsOpen === false ? "Kitchen closed" : "Unavailable"}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2 text-[10px] font-medium uppercase tracking-wider text-[#94998a]">
          <span className="flex items-center gap-1.5">
            <span
              className={`flex h-3 w-3 items-center justify-center rounded-[3px] border ${
                isVeg ? "border-green-700" : "border-rose-700"
              }`}
            >
              <span
                className={`h-1 w-1 rounded-full ${
                  isVeg ? "bg-green-700" : "bg-rose-700"
                }`}
              />
            </span>
            {isVeg ? "Vegetarian" : "Non-vegetarian"}
          </span>
          {preparationTime && (
            <span className="flex items-center gap-1">
              <Clock3 size={12} />
              Prep {preparationTime} min
            </span>
          )}
        </div>
        <Link
          to={`/foods/${slug}`}
          className="line-clamp-1 text-lg font-bold tracking-tight text-[#30372a] hover:text-orange-700"
        >
          {name}
        </Link>
        {food.restaurantName && (
          <p className="mt-1 line-clamp-1 text-xs font-medium text-[#8a907e]">
            {food.restaurantName}
          </p>
        )}
        {description && (
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#8c8e83]">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f0f0e9] pt-4 mt-5">
          <div>
            <span className="font-bold text-[#35412b]">
              {money(discounted ? discountPrice : price)}
            </span>
            {discounted && (
              <span className="ml-2 text-xs text-[#a3a699] line-through">
                {money(price)}
              </span>
            )}
          </div>
          {onAddToCart ? (
            <button
              type="button"
              disabled={unavailable || adding}
              onClick={add}
              aria-label={`Add ${name} to cart`}
              className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[#dfe5d6] bg-[#f1f5ea] px-3 text-xs font-bold text-[#596e3e] transition hover:bg-[#dfe9d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {adding ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              Add
            </button>
          ) : (
            <Link
              to={`/foods/${slug}`}
              aria-label={`View ${name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5ea] text-[#596e3e]"
            >
              <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-3 text-xs text-rose-700">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
