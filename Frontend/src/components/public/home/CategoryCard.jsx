import { Link } from "react-router-dom";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";
export default function CategoryCard({ category }) {
  if (!category) return null;
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group block rounded-3xl border border-[#e8e7df] bg-[#f1f0e9] p-4 text-center transition hover:-translate-y-1 hover:border-[#b5bda3] hover:bg-[#e9ecdf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
    >
      <OptimizedImage
        src={category.image}
        alt={category.name}
        rounded="rounded-full"
        objectFit="cover"
        className="aspect-square w-full"
        wrapperClassName="mx-auto max-w-32 overflow-hidden rounded-full border-4 border-white/75 shadow-sm"
      />
      <h3 className="mt-4 text-sm font-bold text-[#3a4032]">{category.name}</h3>
      <span className="mt-1 block text-[10px] uppercase tracking-widest text-[#838772]">
        Explore menu
      </span>
    </Link>
  );
}
