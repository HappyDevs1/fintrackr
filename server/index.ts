import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./controllers/authenticate";
import { getAccounts } from "./controllers/accounts";
// Have to fix the error for this import
// import { getAccountBalance } from "./controllers/accounts";
import { getTransactions } from "./controllers/transactions";
import { spawn } from 'child_process';
import cors from 'cors';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const modelPath = "./model/predictModel.py";

app.use(express.json());
app.use(cors())

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
app.get('/forecast', async (req: Request, res: Response) => {
  try {
    const transactions = await getTransactions();
    
    const pythonProcess = spawn('python', [modelPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.write(JSON.stringify(transactions));
    pythonProcess.stdin.end();

    let result = '';
    let errorOutput = '';  // <-- New: Capture stderr

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture Python errors
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python Error: ${errorOutput}`);  // Log the actual error
        return res.status(500).json({ 
          error: "Model failed",
          pythonError: errorOutput  // <-- Send to client for debugging
        });
      }
      
      try {
        const { forecast, alerts, plot } = JSON.parse(result);
        res.json({
          forecast,
          alerts,
          plot: `data:image/png;base64,${plot}`
        });
      } catch (e) {
        res.status(500).json({ 
          error: "Invalid model output",
          pythonOutput: result  // <-- Help debug parsing issues
        });
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});