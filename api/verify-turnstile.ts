// Serverless verification handler for Cloudflare Turnstile tokens
export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { token } = req.body || {};

    if (!token) {
      return res.status(400).json({ success: false, message: 'Missing Turnstile verification token' });
    }

    const secretKey =
      (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '').trim() ||
      '1x0000000000000000000000000000000AA'; // Cloudflare official always-passing test secret

    // If using the official dummy test token or keys
    if (token === 'XXXX.DUMMY.TOKEN.XXXX' || secretKey.startsWith('1x0000000000000000000000000000000AA')) {
      return res.status(200).json({ success: true, message: 'Test token verified successfully' });
    }

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    // Forward IP address if available
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    if (ip) {
      formData.append('remoteip', String(ip).split(',')[0].trim());
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await response.json();

    if (outcome.success) {
      return res.status(200).json({ success: true });
    } else {
      console.warn('Turnstile verification failed:', outcome['error-codes']);
      return res.status(400).json({
        success: false,
        message: 'Security check failed. Please refresh and try again.',
        errors: outcome['error-codes'],
      });
    }
  } catch (error) {
    console.error('Turnstile verification endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Internal verification error' });
  }
}
