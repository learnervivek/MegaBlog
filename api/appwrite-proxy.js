// Vercel serverless proxy for Appwrite
// Forwards incoming requests from the frontend to the configured Appwrite endpoint
// and returns the upstream response. Use this when you cannot modify Appwrite CORS.

export default async function handler(req, res) {
  try {
    const APPWRITE_URL = process.env.VITE_APPWRITE_URL || process.env.APPWRITE_URL || 'https://fra.cloud.appwrite.io';

    // Build the upstream URL by stripping the proxy prefix from the path
    // Incoming path: /api/appwrite-proxy/v1/account -> upstream: https://.../v1/account
    const prefix = '/api/appwrite-proxy';
    const incomingPath = req.url || '';
    const forwardPath = incomingPath.startsWith(prefix) ? incomingPath.slice(prefix.length) : incomingPath;
    const upstream = APPWRITE_URL.replace(/\/$/, '') + forwardPath;

    // Read raw request body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    const bodyBuffer = Buffer.concat(chunks);

    // Build headers for upstream. Copy most headers but remove host to avoid conflicts.
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (k === 'host') continue;
      forwardHeaders[k] = v;
    }

    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : bodyBuffer,
      redirect: 'manual',
    };

    const upstreamRes = await fetch(upstream, fetchOptions);

    // Forward status
    res.statusCode = upstreamRes.status;

    // Forward headers from upstream. Some headers like content-length will be set automatically.
    upstreamRes.headers.forEach((value, key) => {
      // Avoid exposing Appwrite's CORS header from upstream; responses are same-origin now.
      if (key.toLowerCase() === 'access-control-allow-origin') return;
      // setHeader will overwrite duplicates; for set-cookie we allow multiple values
      if (key.toLowerCase() === 'set-cookie') {
        // Node's fetch may combine cookies; forward as-is
        res.setHeader('set-cookie', value);
      } else {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await upstreamRes.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Proxy error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Proxy failed', details: String(err) }));
  }
}
