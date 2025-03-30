import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./controllers/authenticate";
import { getAccounts } from "./controllers/accounts";
// Have to fix the error for this import
// import { getAccountBalance } from "./controllers/accounts";
import { getTransactions } from "./controllers/transactions";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Fintrackr API is running!");
}); 

app.get('/auth', auth); // Authentication route
app.get('/accounts', async (req: Request, res: Response) => {
  try {
    const accounts = await getAccounts();
    res.status(200).json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}); // Accounts route

// Have to fix the error here

// app.get('/account/balance', async (req: Request, res: Response) => {
//   try {
//     const balance = await getAccountBalance();
//     res.status(200).json(balance);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   } 
// }); // Account balance route
app.use('/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await getTransactions();
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}); // Transactions route

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});