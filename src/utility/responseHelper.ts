import { Response } from "express";

export const buildSuccessRespone = <T>(
  res: Response,
  data: T,
  message: string
): void => {
  res.json({
    status: "success",
    data,
    message,
  });
};
export const buildErrorRespone = (res: Response, message: string): void => {
  res.json({
    status: "error",
    message: message || "Something went wrong",
  });
};
