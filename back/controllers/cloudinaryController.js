import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_KEY;
const api_secret = process.env.CLOUD_SECRET;
// Configure Cloudinary globally
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const deleteImage = async (req, res) => {
  const { publicId } = req.body;

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      { public_id: publicId, timestamp },
      api_secret
    );

    // Perform deletion
    const result = await cloudinary.uploader.destroy(publicId, {
      timestamp,
      signature,
      api_key: api_key,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { deleteImage };
