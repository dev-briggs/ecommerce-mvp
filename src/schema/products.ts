import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const MAX_IMAGE_SIZE = 80 * 1024; // 80kb

const MIN_IMAGE_DIMENSIONS = { width: 200, height: 200 };
const MAX_IMAGE_DIMENSIONS = { width: 4096, height: 4096 };

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// declared as a separate variable to be reusable for update schema
const fileSchema =
  // use ternary to fix Error: FileReader is not defined
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(File, {
          message: "Please select a file.",
        })
        .refine(
          (file) => file?.size <= MAX_FILE_SIZE,
          `Please choose a file smaller than ${formatBytes(MAX_FILE_SIZE)}`
        );
const imageSchema =
  // use ternary to fix Error: FileReader is not defined
  typeof window === "undefined"
    ? z.any()
    : z
        .instanceof(File, {
          message: "Please select an image file.",
        })
        .refine(
          (file) => file?.size <= MAX_IMAGE_SIZE,
          `Please choose an image smaller than ${formatBytes(MAX_IMAGE_SIZE)}`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .refine(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                  const meetsDimensions =
                    img.width >= MIN_IMAGE_DIMENSIONS.width &&
                    img.height >= MIN_IMAGE_DIMENSIONS.height &&
                    img.width <= MAX_IMAGE_DIMENSIONS.width &&
                    img.height <= MAX_IMAGE_DIMENSIONS.height;
                  resolve(meetsDimensions);
                };
                img.src = e.target?.result as string;
              };
              reader.readAsDataURL(file);
            }),
          {
            message: `The image dimensions are invalid. Please upload an image between ${MIN_IMAGE_DIMENSIONS.width}x${MIN_IMAGE_DIMENSIONS.height} and ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height} pixels.`,
          }
        );

export const productSchemaBase = z.object({
  name: z.string().min(1, "Required"),
  priceInCents: z.coerce
    .number({ message: "Required" })
    .int()
    .min(1)
    .positive("Must be greater than 0"),
  description: z.string().min(1, "Required"),
});

export const addProductSchema = z
  .object({
    file: fileSchema.refine((file) => file?.size > 0, "Required"),
    image: imageSchema.refine((file) => file?.size > 0, "Required"),
  })
  .merge(productSchemaBase);

export const editProductSchema = z
  .object({
    file: fileSchema.optional(),
    image: imageSchema.optional(),
  })
  .merge(productSchemaBase);

export const productFormSchema = z.union([addProductSchema, editProductSchema]);
