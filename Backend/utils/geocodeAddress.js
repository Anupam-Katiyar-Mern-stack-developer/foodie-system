export const geocodeAddress = async ({ addressLine, city, state, pincode }) => {
  if (!addressLine || !city || !state || !pincode) {
    const error = new Error("Complete delivery address is required");
    error.statusCode = 400;
    throw error;
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    const error = new Error("Geocoding API key is not configured");
    error.statusCode = 500;
    throw error;
  }

  const text = [addressLine, city, state, pincode, "India"].join(", ");

  const url = new URL("https://api.geoapify.com/v1/geocode/search");

  url.searchParams.set("text", text);
  url.searchParams.set("format", "json");
  url.searchParams.set("filter", "countrycode:in");
  url.searchParams.set("limit", "1");
  url.searchParams.set("apiKey", apiKey);

  let response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    const error = new Error("Address lookup failed. Please try again.");
    error.statusCode = 503;
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Address lookup service is unavailable");
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();
  const result = data.results?.[0];

  const latitude = Number(result?.lat);
  const longitude = Number(result?.lon);

  const coarseResults = [
    "country",
    "state",
    "county",
    "city",
    "postcode",
    "district",
    "suburb",
  ];

  if (
    result?.lat == null ||
    result?.lon == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    coarseResults.includes(result?.result_type) ||
    (result?.postcode &&
      String(result.postcode).trim() !== String(pincode).trim())
  ) {
    const error = new Error(
      "Exact enough location nahi mili. Address mein street/area aur sahi pincode add karo.",
    );
    error.statusCode = 422;
    throw error;
  }

  return { latitude, longitude };
};
