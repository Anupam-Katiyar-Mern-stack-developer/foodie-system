import {
  useEffect,
  useState,
} from "react";

const OptimizedImage = ({
  src,
  alt = "",

  fallbackSrc = "",

  loading = "lazy",

  objectFit = "cover",

  aspectRatio = "",

  rounded = "rounded-xl",

  className = "",
  wrapperClassName = "",

  showLoader = true,

  ...props
}) => {
  const [imageLoaded, setImageLoaded] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);


  // src change hone par state reset
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);


  const handleLoad = () => {
    setImageLoaded(true);
  };


  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };


  const finalSrc =
    imageError && fallbackSrc
      ? fallbackSrc
      : src;


  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  };


  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-gray-100

        ${aspectRatio}
        ${rounded}
        ${wrapperClassName}
      `}
    >
      {/* Loading Skeleton */}
      {showLoader &&
        !imageLoaded && (
          <div
            className="
              absolute
              inset-0
              animate-pulse
              bg-gray-200
            "
            aria-hidden="true"
          />
        )}


      {/* No Image */}
      {!finalSrc ? (
        <div
          className="
            flex
            h-full
            min-h-32
            w-full
            items-center
            justify-center
            px-4
            text-center
            text-sm
            text-gray-400
          "
        >
          No image available
        </div>
      ) : (
        <img
          src={finalSrc}

          alt={alt}

          loading={loading}

          decoding="async"

          draggable="false"

          onLoad={handleLoad}

          onError={handleError}

          className={`
            h-full
            w-full

            transition-opacity
            duration-300

            ${
              imageLoaded
                ? "opacity-100"
                : "opacity-0"
            }

            ${
              objectFitClasses[
                objectFit
              ] ||
              objectFitClasses.cover
            }

            ${className}
          `}

          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;