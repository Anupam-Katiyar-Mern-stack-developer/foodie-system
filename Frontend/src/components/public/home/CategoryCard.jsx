import {
  Link,
} from "react-router-dom";

import {
  FaArrowRight,
} from "react-icons/fa";

import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";


const CategoryCard = ({
  category,
}) => {
  if (!category) {
    return null;
  }


  return (
    <Link
      to={`/categories/${category.slug}`}

      className="
        group
        block
        min-w-0

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-orange-500/40
        focus-visible:ring-offset-2
      "
    >
      <div
        className="
          relative

          overflow-hidden

          rounded-[1.6rem]

          border
          border-orange-100/80

          bg-white

          p-2.5

          shadow-sm

          transition
          duration-300

          group-hover:-translate-y-1
          group-hover:border-orange-200
          group-hover:shadow-xl
          group-hover:shadow-orange-900/10
        "
      >
        {/* IMAGE */}
        <div
          className="
            relative

            aspect-square

            overflow-hidden

            rounded-[1.25rem]

            bg-orange-50
          "
        >
          <OptimizedImage
            src={category.image}

            alt={category.name}

            aspectRatio="aspect-square"

            rounded="rounded-[1.25rem]"

            className="
              transition
              duration-500

              group-hover:scale-110
            "
          />


          {/* IMAGE OVERLAY */}
          <div
            className="
              pointer-events-none

              absolute
              inset-0

              bg-gradient-to-t
              from-slate-950/35
              via-transparent
              to-transparent

              opacity-70
            "
          />


          {/* ARROW */}
          <div
            className="
              absolute
              bottom-2.5
              right-2.5

              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-full

              bg-white/90

              text-orange-600

              shadow-md
              backdrop-blur

              transition
              duration-300

              group-hover:rotate-[-15deg]
              group-hover:bg-orange-500
              group-hover:text-white
            "
          >
            <FaArrowRight
              className="
                h-3
                w-3
              "
            />
          </div>
        </div>


        {/* CATEGORY NAME */}
        <div
          className="
            px-1
            pb-1
            pt-3

            text-center
          "
        >
          <h3
            className="
              truncate

              text-sm
              font-extrabold
              text-slate-900

              transition

              group-hover:text-orange-600

              sm:text-base
            "
          >
            {category.name}
          </h3>

          <p
            className="
              mt-0.5

              text-[10px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-slate-400

              sm:text-xs
            "
          >
            Explore food
          </p>
        </div>
      </div>
    </Link>
  );
};


export default CategoryCard;