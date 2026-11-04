
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { name, email, phone, artist, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        error: "Please complete all required fields."
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid booking information."
      });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      phone.length > 30 ||
      message.length > 2000
    ) {
      return res.status(400).json({
        error: "Some information is too long."
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(503).json({
        error: "Booking service is not configured yet."
      });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          artist: String(artist || "Any Available Artist").slice(0, 100),
          message: message.trim(),
          status: "pending"
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        error: "Could not save your booking."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking request received."
    });

  } catch (error) {
    return res.status(500).json({
      error: "An unexpected server error occurred."
    });
  }
}
