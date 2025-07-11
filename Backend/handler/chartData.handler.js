import axios from 'axios';
import upstox from 'upstox-js-sdk';

const apiKey = 'fd60bd07-412d-476d-a462-98953b1e478c';
const apiSecret = 'gvfpp1qbvd';
const redirectUri = 'https://google.com'; // set in app console

// After user logs in, you'll get a code in the callback URL
const authCode = 'CODE_FROM_CALLBACK';

async function getAccessToken() {
  const client = new upstox.ApiClient(); // false disables sandbox
  apiClient.basePath = "https://api.upstox.com/v3";
  apiClient.authentications["OAUTH2"].accessToken = "YOUR_ACCESS_TOKEN";
  return client;
}
export async function getHistoricalData() {
   try {
    const url = `https://api.upstox.com/v3/historical-candle/NSE_EQ|INE0MJQ01020/hours/1/2025-06-30/2025-06-01`;

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
      },
      params:{
        instrumentKey : "NSE_EQ|INE0MJQ01020"
      }
    });

    // console.log(`Candles for ${instrumentKey}:`);
    console.log(JSON.stringify(response.data.data.candles, null, 2));
    return res.data.data;
  } catch (err) {
    console.error('Error fetching candles:', err.response?.data || err.message);
    console.log(err)
  }

}
