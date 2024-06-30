import axios from 'axios';

export async function clearCloudflareCache({ zoneId, apiToken }) {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`
  const body = { purge_everything: true };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`,
  };

  return await axios.post(url, body, { headers });
}
