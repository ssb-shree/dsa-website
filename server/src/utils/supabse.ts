import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import type { Request, Response } from "express";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/status-codes";
import ApiError from "./apiError";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Organization } from "../models/organization.model";
import { User } from "../models/user.model";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

export const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadImage = async (req: AuthenticatedRequest, res: Response) => {
  try {

    if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
      const { userID } = req.user;
    
      if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");
    
      // check if such organization exist or not
      const organizationToUpdate = await Organization.findOne({ slug : "dsa" });
      if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");
    
      // check if authenticated user is in the organization
      const user = await User.findById(userID);
      if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
    
      const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
      if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied, you arent authorised to perform this action");


    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }    

    const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;

    const { error } = await supabase.storage
      .from("dsa website") // Bucket name
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    const { data } = supabase.storage
      .from("dsa website")
      .getPublicUrl(fileName);

    return res.status(200).json({
      url: data.publicUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to upload image",
    });
  }
};

export default uploadImage;