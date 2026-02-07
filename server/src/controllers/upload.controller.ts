import asyncHandler from "../utils/asyncHandler";
import cloudinary from "../utils/cloudinary";
import { BAD_REQUEST, OK } from "../constants/status-codes";

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) res.status(BAD_REQUEST).json({ message: "image not found", success: false });

  const result = await cloudinary.uploader.upload(
    `data:${req.file?.mimetype};base64,${req.file?.buffer.toString("base64")}`,
    { folder: "uploads" },
  );

  res.status(OK).json({ success: true, url: result.secure_url });
});

export { uploadImage };
