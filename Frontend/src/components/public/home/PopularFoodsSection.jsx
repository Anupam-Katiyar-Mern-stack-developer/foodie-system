import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Container from "../../common/Container/Container";
import Skeleton from "../../common/Skeleton/Skeleton";
import EmptyState from "../../common/EmptyState/EmptyState";
import FoodCard from "../FoodCard/FoodCard";

export default function PopularFoodsSection({
  foods = [],
  loading = false,
  onAddToCart,
}) {
  return (
    <section className="py-10 sm:py-14" aria-label="Meet your next favourite.">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-9">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#8a714c]">
              The good stuff
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.035em] text-[#272b24] sm:text-[2.5rem]">
              Meet your next favourite.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#77786e]">
              Thoughtfully made by the kitchens around you.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dbded2] bg-white px-5 text-xs font-bold text-[#48533c] transition hover:border-[#9baf85] hover:bg-[#f0f3eb]"
          >
            Explore the menu
            <ArrowUpRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} height="h-56" rounded="rounded-3xl" />
            ))}
          </div>
        ) : foods.length ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {foods.slice(0, 8).map((item) => (
              <FoodCard
                key={item.slug || item.id}
                food={item}
                onAddToCart={onAddToCart}
              />
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
