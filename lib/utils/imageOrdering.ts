import { SocialMediaImage } from '@/lib/types/image';
import { readImageMetadata, saveImageMetadata } from './imageStorage';

// Reorder images by updating their order values
export async function reorderImages(imageIds: string[]): Promise<SocialMediaImage[]> {
  try {
    const images = await readImageMetadata();
    
    // Create a map for quick lookup
    const imageMap = new Map(images.map(img => [img.id, img]));
    
    // Update order based on the provided array
    const reorderedImages: SocialMediaImage[] = [];
    
    imageIds.forEach((id, index) => {
      const image = imageMap.get(id);
      if (image) {
        reorderedImages.push({
          ...image,
          order: index + 1,
          updatedAt: new Date()
        });
      }
    });
    
    // Add any images that weren't in the reorder list (shouldn't happen in normal use)
    images.forEach(img => {
      if (!imageIds.includes(img.id)) {
        reorderedImages.push({
          ...img,
          order: reorderedImages.length + 1,
          updatedAt: new Date()
        });
      }
    });
    
    // Save the reordered images
    await saveImageMetadata(reorderedImages);
    
    return reorderedImages.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error reordering images:', error);
    throw new Error('Failed to reorder images');
  }
}

// Move an image to a specific position
export async function moveImageToPosition(imageId: string, newPosition: number): Promise<SocialMediaImage[]> {
  try {
    const images = await readImageMetadata();
    const sortedImages = images.sort((a, b) => a.order - b.order);
    
    const imageIndex = sortedImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      throw new Error('Image not found');
    }
    
    // Remove the image from its current position
    const [movedImage] = sortedImages.splice(imageIndex, 1);
    
    // Insert at new position (clamp to valid range)
    const targetIndex = Math.max(0, Math.min(newPosition - 1, sortedImages.length));
    sortedImages.splice(targetIndex, 0, movedImage);
    
    // Update all order values
    const reorderedImages = sortedImages.map((img, index) => ({
      ...img,
      order: index + 1,
      updatedAt: new Date()
    }));
    
    await saveImageMetadata(reorderedImages);
    
    return reorderedImages;
  } catch (error) {
    console.error('Error moving image:', error);
    throw new Error('Failed to move image');
  }
}

// Get images sorted by order
export async function getImagesByOrder(): Promise<SocialMediaImage[]> {
  try {
    const images = await readImageMetadata();
    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error getting ordered images:', error);
    throw new Error('Failed to get ordered images');
  }
}

// Normalize order values (ensure they are sequential starting from 1)
export async function normalizeImageOrder(): Promise<SocialMediaImage[]> {
  try {
    const images = await readImageMetadata();
    const sortedImages = images.sort((a, b) => a.order - b.order);
    
    const normalizedImages = sortedImages.map((img, index) => ({
      ...img,
      order: index + 1,
      updatedAt: new Date()
    }));
    
    await saveImageMetadata(normalizedImages);
    
    return normalizedImages;
  } catch (error) {
    console.error('Error normalizing image order:', error);
    throw new Error('Failed to normalize image order');
  }
}

// Swap positions of two images
export async function swapImagePositions(imageId1: string, imageId2: string): Promise<SocialMediaImage[]> {
  try {
    const images = await readImageMetadata();
    
    const image1 = images.find(img => img.id === imageId1);
    const image2 = images.find(img => img.id === imageId2);
    
    if (!image1 || !image2) {
      throw new Error('One or both images not found');
    }
    
    // Swap order values
    const tempOrder = image1.order;
    image1.order = image2.order;
    image2.order = tempOrder;
    
    // Update timestamps
    image1.updatedAt = new Date();
    image2.updatedAt = new Date();
    
    await saveImageMetadata(images);
    
    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error swapping image positions:', error);
    throw new Error('Failed to swap image positions');
  }
}