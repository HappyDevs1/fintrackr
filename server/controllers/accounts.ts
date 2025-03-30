import axios from "axios";
import authenticate from "../middlewares/authMiddleware";
import dotenv from "dotenv";
dotenv.config();

const apiKey: string | undefined = process.env.API_KEY;
const accountId: string | undefined = process.env.ACCOUNT_ID;

if (!apiKey || !accountId) {
  throw new Error("Missing required environment variables");
}

/**
 * Fetches the list of accounts.
 * @returns {Promise<Array<any> | null>} 
 */

export async function getAccounts(): Promise<Array<any> | null> {
  try {
    const token: string | null = await authenticate();
    if (!token) {
      console.error('Cannot fetch accounts: Authentication failed');
      return null;
    }

    const response = await axios<{ data: { accounts: any[] } }>({
      method: 'get',
      url: 'https://openapisandbox.investec.com/za/pb/v1/accounts',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey
      }
    });
    
    const accounts = response.data.data.accounts;
    console.log(`Successfully retrieved ${accounts.length} accounts`);

    return accounts;
  } catch (error: any) {
    console.error('Error fetching accounts:', 
      error.response ? 
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
      error.message
    );
    return null;
  }
}

// Have to fix the error here

// /**
//  * Fetches the balance of a specific account.
//  * @returns {Promise<Object | null>} 
//  */
// export async function getAccountBalance(): Promise<Record<string, any> | null> { 
//   try {
//     const token: string | null = await authenticate();
//     if (!token) {
//       console.error('Cannot fetch account balance: Authentication failed');
//       return null;
//     }

//     const response = await axios<{ data: Record<string, any> }>({
//       method: 'get',
//       url: `https://openapisandbox.investec.com/za/pb/v1/accounts/${accountId}/balance`, 
//       headers: { 
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         'x-api-key': apiKey
//       }
//     });

//     return response.data.data;
//   } catch (error: any) {
//     console.error(`Error fetching balance for account ${accountId}:`, 
//       error.response ? 
//       `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
//       error.message
//     );
//     return null;
//   }
// }
