import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const clientId: string | undefined = process.env.CLIENT_ID;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const apiKey: string | undefined = process.env.API_KEY;

if (!clientId || !clientSecret || !apiKey) {
  throw new Error("Missing required environment variables");
}

/**
 * Authenticates with the Investec API and retrieves an access token.
 * @returns {Promise<string | null>}
 */
async function authenticate(): Promise<string | null> {
  try {
    const basicAuthToken: string = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios<{ access_token: string }>({
      method: 'post',
      url: 'https://openapisandbox.investec.com/identity/v2/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuthToken}`,
        'x-api-key': apiKey
      },
      data: 'grant_type=client_credentials&scope=accounts'
    });
    
    if (response.data.access_token) {
      console.log("Reveived access token:", response.data.access_token);
      return response.data.access_token;
    } else {
      console.error('Authentication failed: No access token received');
      return null;
    }

  } catch (error: any) {
    console.error('Authentication failed:',
      error.response ?
        `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` :
        error.message
    );
    return null;
  }
}

export default authenticate;
