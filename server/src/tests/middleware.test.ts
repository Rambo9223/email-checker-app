import { errorHandler } from "../middleware/errorHandler";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

// ─── Mock helpers ─────────────────────────────────────────────────────────────

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res); // allows chaining: res.status(400).json(...)
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = {} as Request;
const mockNext: NextFunction = jest.fn();

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("errorHandler", () => {

  it("returns 400 with the error message for a generic Error", () => {
    const res = mockRes();
    const err = new Error("Something went wrong");

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Something went wrong",
    });
  });

  it("returns 400 with a file size message for a MulterError LIMIT_FILE_SIZE", () => {
    const res = mockRes();
    const err = new multer.MulterError("LIMIT_FILE_SIZE");

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "File exceeds the 25 MB limit",
    });
  });

  it("returns 400 with the multer message for other MulterErrors", () => {
    const res = mockRes();
    const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE");

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: err.message,
    });
  });

  it("returns 500 for an unknown non-Error value", () => {
    const res = mockRes();

    errorHandler("some string error", mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Internal server error",
    });
  });

});