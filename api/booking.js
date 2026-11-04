
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, artist, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        error: "Please complete all required fields."
      });
    }

    const url = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secret) {
      return res.status(503).json({
        error: "Booking service is not configured."
      });
    }

    const response = await fetch(
      `${url}/rest/v1/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": secret,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: String(name).trim(),
          email: String(email).trim(),
          phone: String(phone).trim(),
          artist: String(artist || "Any Available Artist"),
          message: String(message).trim(),
          status: "pending"
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        error: "Could not save booking."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking received."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error."
    });
  }
}
