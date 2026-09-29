import Skeleton from "../../common/Skeleton/Skeleton";

const RestaurantCardSkeleton = () => {
    return (
        <div
            className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-3
      "
        >
            <Skeleton
                height="h-44"
                rounded="rounded-xl"
            />

            <div className="mt-4 space-y-3">
                <Skeleton
                    width="w-2/3"
                    height="h-5"
                />

                <Skeleton
                    width="w-full"
                    height="h-4"
                />

                <Skeleton
                    width="w-1/2"
                    height="h-4"
                />
            </div>
        </div>
    );
};

export default RestaurantCardSkeleton;