import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authenticate from "./middlewares/authMiddleware";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Fintrackr API is running!");
}); 

app.get('/auth', async (req: Request, res: Response): Promise<void> => {
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
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});