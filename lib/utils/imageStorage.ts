import { promises as fs } from 'fs';
import path from 'path';
import { SocialMediaImage } from '@/lib/types/image';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'social-media');
const METADATA_FILE = path.join(process.cwd(), 'data', 'images-metadata.json');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    await fs.mkdir(path.dirname(METADATA_FILE), { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Read image metadata from JSON file
export async function readImageMetadata(): Promise<SocialMediaImage[]> {
  try {
    await ensureDirectories();
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    const images = JSON.parse(data);
    
    // Convert date strings back to Date objects
    return images.map((img: any) => ({
      ...img,
      uploadedAt: new Date(img.uploadedAt),
      updatedAt: new Date(img.updatedAt)
    }));
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save image metadata to JSON file
export async function saveImageMetadata(images: SocialMediaImage[]): Promise<void> {
  try {
    await ensureDirectories();
    await fs.writeFile(METADATA_FILE, JSON.stringify(images, null, 2));
  } catch (error) {
    console.error('Error saving image metadata:', error);
    throw new Error('Failed to save image metadata');
  }
}

// Save uploaded image file
export async function saveUploadedImage(file: File): Promise<{ path: string; fullPath: string }> {
  try {
    await ensureDirectories();
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = path.extname(file.name);
    const filename = `${timestamp}-${randomId}${extension}`;
    
    const fullPath = path.join(IMAGES_DIR, filename);
    const relativePath = `/social-media/${filename}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write file
    await fs.writeFile(fullPath, buffer);
    
    return {
      path: relativePath,
      fullPath
    };
  } catch (error) {
    console.error('Error saving uploaded image:', error);
    throw new Error('Failed to save uploaded image');
  }
}

// Delete image file
export async function deleteImageFile(relativePath: string): Promise<void> {
  try {
    // Convert relative path to full path
    const filename = path.basename(relativePath);
    const fullPath = path.join(IMAGES_DIR, filename);
    
    // Check if file exists before attempting to delete
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (error) {
      // File doesn't exist, which is fine for deletion
      console.warn(`File not found for deletion: ${fullPath}`);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
    throw new Error('Failed to delete image file');
  }
}

// Get image file stats
export async function getImageStats(relativePath: string): Promise<{ size: number; exists: boolean }> {
  try {
    const filename = path.basename(relativePath);
    const fullPath = path.join(IMAGES_DIR, filename);
    
    const stats = await fs.stat(fullPath);
    return {
      size: stats.size,
      exists: true
    };
  } catch (error) {
    return {
      size: 0,
      exists: false
    };
  }
}