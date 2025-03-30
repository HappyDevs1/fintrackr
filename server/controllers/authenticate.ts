import { Request, Response } from "express";
import authenticate from "../middlewares/authMiddleware";

export const auth = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await authenticate();

    if (token) {
      console.log('Token Sent in Response:', token);
      res.json({ access_token: token });
    } else {
      console.error("Authentication failed, no token received.");
      res.status(500).json({ error: "Authentication failed" });
    }
  } catch (error) {
    console.error("Error in authentication route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}