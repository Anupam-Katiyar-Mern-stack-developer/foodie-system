import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";
export default function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;
  const { slug, restaurantName, description, logo, addressLine, city, isOpen } =
    restaurant;
  return (
    <Link
      to={`/restaurants/${slug}`}
      className="group block h-full overflow-hidden rounded-[1.6rem] border border-[#e4e5dc] bg-white transition hover:-translate-y-1 hover:border-[#bfc9b2] hover:shadow-lg hover:shadow-[#434d2e]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
    >
      <div className="relative overflow-hidden bg-[#eaece2]">
        <OptimizedImage
          src={logo}
          alt={restaurantName}
          aspectRatio="aspect-[16/10]"
          rounded="rounded-none"
          className="aspect-[16/10] w-full transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
            isOpen ? "bg-[#f3f8e9] text-[#4e672d]" : "bg-white text-slate-600"
          }`}
        >
          {isOpen ? "Open for orders" : "Currently closed"}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-[#333d2a]">
            {restaurantName}
          </h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e5e7dc] text-[#7d8b68] transition group-hover:bg-[#edf2e5]">
            <ArrowUpRight size={17} />
          </span>
        </div>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8b9080]">
            {description}
          </p>
        )}
        <p className="mt-5 flex items-start gap-2 border-t border-[#eeefe8] pt-4 text-xs leading-5 text-[#828875]">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-1">
            {[addressLine, city].filter(Boolean).join(", ") || "Local kitchen"}
          </span>
        </p>
      </div>
    </Link>
  );
}
