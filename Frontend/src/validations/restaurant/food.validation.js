import {
  z,
} from "zod";


const optionalNumber =
  z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return undefined;
      }

      return Number(value);
    },

    z
      .number({
        invalid_type_error:
          "Enter a valid number",
      })
      .positive(
        "Value must be greater than 0"
      )
      .optional()
  );


export const getFoodSchema = ({
  isEditMode = false,
} = {}) => {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Food name must be at least 2 characters"
        )
        .max(
          120,
          "Food name is too long"
        ),

      description: z
        .string()
        .trim()
        .max(
          1000,
          "Description is too long"
        )
        .optional()
        .or(
          z.literal("")
        ),

      categorySlug: z
        .string()
        .trim()
        .min(
          1,
          "Please select a category"
        ),

      price: z.coerce
        .number()
        .positive(
          "Price must be greater than 0"
        ),

      discountPrice:
        optionalNumber,

      preparationTime:
        z.coerce
          .number()
          .int(
            "Preparation time must be a whole number"
          )
          .positive(
            "Preparation time must be greater than 0"
          ),

      isVeg:
        z.boolean(),

      isAvailable:
        z.boolean(),

      /*
       * CommonForm ke file field se
       * File / FileList aa sakta hai.
       *
       * Backend integration ke time
       * service FormData handle karegi.
       */
      image:
        z
          .any()
          .optional()
          .nullable(),
    })

    .superRefine(
      (
        values,
        ctx
      ) => {
        /*
         * DISCOUNT
         */

        if (
          values.discountPrice !==
            undefined &&
          values.discountPrice >=
            values.price
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode
                .custom,

            path: [
              "discountPrice",
            ],

            message:
              "Discount price must be less than regular price",
          });
        }


        /*
         * IMAGE
         *
         * Edit mode me new image optional hai.
         * Existing image backend me rahegi.
         *
         * Add mode me exact backend image
         * requirement integrate karte time
         * final enforce karenge because
         * CommonForm file return shape
         * File/FileList ho sakta hai.
         */

        if (
          !isEditMode &&
          values.image ===
            undefined
        ) {
          // Intentionally backend
          // integration tak flexible.
        }
      }
    );
};