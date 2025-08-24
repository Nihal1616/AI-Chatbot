import "dotenv/config";

const getOpenAPIResponse=async(message)=>{
    if (!message || typeof message !== "string" || message.trim() === "") {
      throw new Error("Invalid or missing 'message' parameter");
    }


  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content:message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options
    );
    const data= await response.json();

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Error fetching from Groq API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
    
}

export default getOpenAPIResponse;