import axios from "axios";
import authenticate from "../middlewares/authMiddleware";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.API_KEY;
const accountId = process.env.ACCOUNT_ID;

/**
 * Fetches the list of accounts.
 * @returns {Promise<Array<any> | null>} 
 */

export async function getTransactions(): Promise<Array<any> | null> {
  try {
    const token: string | null = await authenticate();
    if (!token) {
      console.error('Cannot fetch accounts: Authentication failed');
      return null;
    }

    const response = await axios({
      method: 'get',
      url: `https://openapisandbox.investec.com/za/pb/v1/accounts/${accountId}/transactions`,
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey
      }
    });

    const transactions = response.data;

    console.log(`Successfully retrieved: ${transactions.length} transactions`);

    return transactions;

  } catch (error: any) {
    console.error('Error fetching accounts:', 
      error.response ? 
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
      error.message
    );
    return null;
  }

  return null;
}
