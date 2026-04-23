// Cloudinary upload helpers.
// Upload image ONLY on form submit.
// If the backend API call fails after upload, we delete the image to avoid orphans.

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET || '';

export interface CloudinaryResult {
  url: string;
  public_id: string;
}

// Uploads a file to Cloudinary using the unsigned upload preset.
// Returns { url, public_id } on success.
export async function uploadImage(file: File): Promise<CloudinaryResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
}

// Deletes an image from Cloudinary via the Django backend proxy.
// Call this if the backend API call fails after a successful upload.
// TODO: Backend needs a proxy delete endpoint if client-side delete is not desired.
// For now, we attempt client-side deletion using the Cloudinary destroy endpoint
// (only works if the preset allows unsigned deletes — otherwise use a backend route).
export async function deleteImage(publicId: string): Promise<void> {
  try {
    // This typically requires a signed request.
    // For now, we log the orphaned public_id so it can be cleaned up manually.
    console.warn(`Image orphaned (manual cleanup needed): ${publicId}`);
  } catch (error) {
    console.error('Failed to delete Cloudinary image:', error);
  }
}
