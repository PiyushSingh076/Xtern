// src/components/Post.js
export const ImageWithFallback = ({ src, alt, className, style }) => {
  const handleError = (e) => {
    e.target.src =
      "https://media.licdn.com/dms/image/v2/D4D03AQFOlMrVmzf8Zg/profile-displayphoto-shrink_400_400/B4DZOnDVWOHoAo-/0/1733674489988?e=1740009600&v=beta&t=0Bp0rCygKyXDsWcHAK6vHqS1YE_DOfVhVf-c6cj7yMo";
  };

  return (
    <img
      src={
        src ||
        "https://media.licdn.com/dms/image/v2/D4D03AQFOlMrVmzf8Zg/profile-displayphoto-shrink_400_400/B4DZOnDVWOHoAo-/0/1733674489988?e=1740009600&v=beta&t=0Bp0rCygKyXDsWcHAK6vHqS1YE_DOfVhVf-c6cj7yMo"
      } // Use fallback if src is undefined or null
      alt={alt || "Fallback Image"}
      className={className}
      style={style}
      onError={handleError}
    />
  );
};
