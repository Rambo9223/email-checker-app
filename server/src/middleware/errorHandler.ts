import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Multer-specific errors (file size, wrong type, etc.)
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      error: err.code === "LIMIT_FILE_SIZE" ? "File exceeds the 25 MB limit" : err.message,
    });
    return;
  }

  // Our own fileFilter rejections
  if (err instanceof Error) {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  res.status(500).json({ success: false, error: "Internal server error" });
}
