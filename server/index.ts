import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./controllers/authenticate";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Fintrackr API is running!");
}); 

app.get('/auth', auth); // Authentication route

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});