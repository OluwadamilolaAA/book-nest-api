import { Request, Response } from "express";
import * as uploadService from "./upload.service";
import { asyncWrapper } from "../../common/middlewares";

const uploadImage = asyncWrapper(async (req: Request, res: Response) => {
  const image = await uploadService.uploadImage(req.file);

  return res.status(200).json({
    msg: "Image uploaded successfully",
    image,
  });
});

export { uploadImage };