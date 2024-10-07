import type { ImageMetadata } from "astro";

/**
 * Utility function to dynamically import a local image using import.meta.glob
 * @param imagePath - The relative path to the image (e.g., from frontmatter).
 * @returns A promise that resolves to the imported image.
 */
export async function getLocalImage(imagePath: string): Promise<ImageMetadata> {
  const images = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/posts/images/*.{jpeg,jpg,png,gif}",
  );

  if (!images[imagePath]) {
    throw new Error(
      `"${imagePath}" does not exist in glob: "/src/assets/posts/images/*.{jpeg,jpg,png,gif}"`,
    );
  }

  const imageImport = await images[imagePath]();

  return imageImport.default;
}
