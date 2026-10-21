import pool from "../config/database.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

export const createAddressService = async ({
  userId,
  label,
  addressLine,
  landmark,
  city,
  state,
  pincode,
  latitude,
  longitude,
  isDefault,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Agar new address default hai,
    // to user ke purane default address ko false karo
    if (isDefault === true) {
      await client.query(
        `
        UPDATE addresses
        SET is_default = FALSE
        WHERE user_id = $1
        `,
        [userId],
      );
    }

    const result = await client.query(
      `
      INSERT INTO addresses (
        user_id,
        label,
        address_line,
        landmark,
        city,
        state,
        pincode,
        latitude,
        longitude,
        is_default
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING
        id,
        user_id AS "userId",
        label,
        address_line AS "addressLine",
        landmark,
        city,
        state,
        pincode,
        latitude,
        longitude,
        is_default AS "isDefault",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      `,
      [
        userId, // $1
        label, // $2
        addressLine, // $3
        landmark || null, // $4
        city, // $5
        state, // $6
        pincode, // $7
        latitude ?? null, // $8
        longitude ?? null, // $9
        isDefault ?? false, // $10
      ],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAddressesService = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        user_id AS "userId",
        label,
        address_line AS "addressLine",
        landmark,
        city,
        state,
        pincode,
        latitude,
        longitude,
        is_default AS "isDefault",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `,
    [userId],
  );

  const addresses = result.rows;

  const validCoordinates = (address) => {
    if (
      address.latitude == null ||
      address.longitude == null ||
      String(address.latitude).trim() === "" ||
      String(address.longitude).trim() === ""
    ) {
      return false;
    }

    const lat = Number(address.latitude);
    const lng = Number(address.longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180
    );
  };

  for (const address of addresses) {
    // Already saved valid coordinates: no API call.
    if (validCoordinates(address)) continue;

    try {
      const coordinates = await geocodeAddress({
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });

      const updated = await pool.query(
        `
          UPDATE addresses
          SET
            latitude = $1,
            longitude = $2,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $3
            AND user_id = $4
            AND address_line IS NOT DISTINCT FROM $5
            AND city IS NOT DISTINCT FROM $6
            AND state IS NOT DISTINCT FROM $7
            AND pincode IS NOT DISTINCT FROM $8
            AND latitude IS NOT DISTINCT FROM $9
            AND longitude IS NOT DISTINCT FROM $10
          RETURNING
            latitude,
            longitude,
            updated_at AS "updatedAt"
        `,
        [
          coordinates.latitude,
          coordinates.longitude,
          address.id,
          userId,
          address.addressLine,
          address.city,
          address.state,
          address.pincode,
          address.latitude,
          address.longitude,
        ],
      );

      if (updated.rows[0]) {
        Object.assign(address, updated.rows[0]);
      } else {
        address.coordinateError =
          "Address changed during lookup. Refresh and try again.";
      }
    } catch (error) {
      // One failed lookup should not hide all saved addresses.
      address.coordinateError = error.message;

      console.error(
        `Address coordinates failed, id=${address.id}:`,
        error.message,
      );
    }
  }

  return addresses;
};

export const updateAddressService = async ({
  userId,
  addressId,
  label,
  addressLine,
  landmark,
  city,
  state,
  pincode,
  latitude,
  longitude,
  isDefault,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const addressCheck = await client.query(
      `
            SELECT id
            FROM addresses 
            WHERE id =$1
            AND user_id =$2
            LIMIT 1
            `,
      [addressId, userId],
    );

    if (addressCheck.rows.length === 0) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }

    if (isDefault === true) {
      await client.query(
        `
                UPDATE addresses SET is_default =FALSE
                WHERE user_id =$1
                `,
        [userId],
      );
    }

    const result = await client.query(
      `
        UPDATE addresses
        SET
          label = COALESCE($1, label),
          address_line = COALESCE($2, address_line),
          landmark = COALESCE($3, landmark),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          pincode = COALESCE($6, pincode),
          latitude = COALESCE($7, latitude),
          longitude = COALESCE($8, longitude),
          is_default = COALESCE($9, is_default),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        AND user_id = $11
        RETURNING
          id,
          user_id AS "userId",
          label,
          address_line AS "addressLine",
          landmark,
          city,
          state,
          pincode,
          latitude,
          longitude,
          is_default AS "isDefault",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [
        label ?? null,
        addressLine ?? null,
        landmark ?? null,
        city ?? null,
        state ?? null,
        pincode ?? null,
        latitude ?? null,
        longitude ?? null,
        isDefault ?? null,
        addressId,
        userId,
      ],
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAddressService = async ({ userId, addressId }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        DELETE FROM addresses
        WHERE id = $1
        AND user_id = $2

        RETURNING
          id,
          is_default
      `,
      [addressId, userId],
    );

    if (result.rows.length === 0) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }

    const deletedAddress = result.rows[0];

    // Agar deleted address default tha
    // to kisi remaining address ko default bana do
    if (deletedAddress.is_default) {
      await client.query(
        `
          UPDATE addresses
          SET
            is_default = TRUE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = (
            SELECT id
            FROM addresses
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
          )
        `,
        [userId],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const setDefaultAddressService = async ({ userId, addressId }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check address user ka hai ya nahi
    const addressCheck = await client.query(
      `
        SELECT id
        FROM addresses
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
      `,
      [addressId, userId],
    );

    if (addressCheck.rows.length === 0) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }

    // User ke saare addresses non-default
    await client.query(
      `
        UPDATE addresses
        SET
          is_default = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `,
      [userId],
    );

    // Selected address default
    const result = await client.query(
      `
        UPDATE addresses
        SET
          is_default = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND user_id = $2

        RETURNING
          id,
          user_id AS "userId",
          label,
          address_line AS "addressLine",
          landmark,
          city,
          state,
          pincode,
          latitude,
          longitude,
          is_default AS "isDefault",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [addressId, userId],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
