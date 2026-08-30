const PISTON_API = "http://localhost:2000/api/v2/execute";

export async function executeCode(req, res) {
  try {
    const { language, version, files } = req.body;

    const response = await fetch(PISTON_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version,
        files,
      }),
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Code execution error:", error);

    res.status(500).json({
      message: "Code execution failed",
      error: error.message,
    });
  }
}