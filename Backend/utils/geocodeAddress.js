export const geocodeAddress = async ({
  addressLine,
  landmark,
  city,
  state,
  pincode,
}) => {
  if (!addressLine || !city || !state || !pincode) {
    const error = new Error("Complete delivery address is required");
    error.statusCode = 400;
    throw error;
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    const error = new Error("Geoapify API key missing");
    error.statusCode = 500;
    throw error;
  }

  const clean = (value) => String(value ?? "").trim();

  const pin = clean(pincode);
  const fullAddress = clean(addressLine);

  // House number remove karke locality search
  // Example: C-639, Barra 8 -> Barra 8
  // Assumes house number is first comma-separated part
  const parts = fullAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const locality = parts.length > 1 ? parts.slice(1).join(", ") : fullAddress;

  const queries = [
    [fullAddress, landmark, city, state, pin, "India"],
    [locality, city, state, pin, "India"],
    [locality, city, state, "India"],
    [city, state, pin, "India"],
  ];

  const candidates = [];

  for (const queryParts of queries) {
    const text = queryParts.map(clean).filter(Boolean).join(", ");

    const url = new URL("https://api.geoapify.com/v1/geocode/search");

    url.searchParams.set("text", text);
    url.searchParams.set("format", "json");
    url.searchParams.set("filter", "countrycode:in");
    url.searchParams.set("limit", "5");
    url.searchParams.set("apiKey", apiKey);

    let response;

    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      const error = new Error("Geoapify request failed");
      error.statusCode = 503;
      throw error;
    }

    if (!response.ok) {
      const error = new Error(`Geoapify HTTP ${response.status}`);
      error.statusCode = 502;
      throw error;
    }

    const data = await response.json();

    for (const result of data.results ?? []) {
      const latitude = Number(result.lat);
      const longitude = Number(result.lon);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
      ) {
        continue;
      }

      // Reject known incorrect pincodes
      if (result.postcode && clean(result.postcode) !== pin) {
        continue;
      }

      const coarseTypes = [
        "country",
        "state",
        "county",
        "city",
        "postcode",
        "district",
        "suburb",
      ];

      const isCoarse = coarseTypes.includes(result.result_type);

      const hasMatchingPostcode = clean(result.postcode) === pin;

      const confidence = Number(result.rank?.confidence) || 0;

      candidates.push({
        latitude,
        longitude,
        formattedAddress: result.formatted,
        resultType: result.result_type,
        confidence,
        isCoarse,
        hasMatchingPostcode,
        query: text,
      });
    }
  }

  if (!candidates.length) {
    const error = new Error(
      "Address location nahi mili. Map par pin select karo.",
    );
    error.statusCode = 422;
    throw error;
  }

  // Prefer more specific results and matching postcode
  candidates.sort((a, b) => {
    const score = (item) =>
      (item.isCoarse ? 0 : 10) +
      (item.hasMatchingPostcode ? 5 : 0) +
      item.confidence;

    return score(b) - score(a);
  });

  const best = candidates[0];

  console.log("Geoapify best match:", best);

  return {
    latitude: best.latitude,
    longitude: best.longitude,
    formattedAddress: best.formattedAddress,
    resultType: best.resultType,
    confidence: best.confidence,

    // Critical: Never treat approximate results as
    // verified house coordinates.
    requiresPinConfirmation: true,
  };
};
