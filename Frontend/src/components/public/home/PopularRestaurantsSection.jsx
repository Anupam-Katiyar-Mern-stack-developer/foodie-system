import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Container from "../../common/Container/Container";
import Skeleton from "../../common/Skeleton/Skeleton";
import EmptyState from "../../common/EmptyState/EmptyState";
import RestaurantCard from "../RestaurantCard/RestaurantCard";

export default function PopularRestaurantsSection({
  restaurants = [],
  loading = false,
}) {
  return (
    <section className="py-10 sm:py-14" aria-label="Great food starts here.">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-9">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8a714c]">
              From your neighbourhood
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#272b24] sm:text-[2.5rem]">
              Great food starts here.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#77786e]">
              Local restaurants. Real kitchens. Plenty to love.
            </p>
          </div>
          <Link
            to="/restaurants"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dbded2] bg-white px-5 text-xs font-bold text-[#48533c] transition hover:border-[#9baf85] hover:bg-[#f0f3eb]"
          >
            All restaurants
            <ArrowUpRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} height="h-56" rounded="rounded-3xl" />
            ))}
          </div>
        ) : restaurants.length ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.slice(0, 6).map((item) => (
              <RestaurantCard key={item.slug || item.id} restaurant={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="More delicious things are on their way"
            description="Check back soon for fresh additions from our local kitchens."
          />
        )}
      </Container>
    </section>
  );
}
