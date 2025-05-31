import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("OpenRouter API Key:", OPENROUTER_API_KEY);

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost", // Change this to your production URL when deployed
  "X-Title": "Qline AI Assistant",
};

// Reusable function to call OpenRouter
async function callOpenRouter(
  prompt,
  max_tokens = 300,
  model = "mistralai/mixtral-8x7b"
) {
  try {
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens,
    };

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("OpenRouter request failed:", error);
    return "Unable to generate a response at this time.";
  }
}

// Function 1: Generate Queue Insights
export async function generateQueueInsights(queueData, analyticsData) {
  const prompt = `
Analyze this queue management data and provide actionable insights:

Queue: ${queueData.name} at ${queueData.location}
Category: ${queueData.category}
Current waiting: ${queueData.peopleInQueue} people
Average wait time: ${queueData.waitTime}

Analytics data:
- Total served: ${analyticsData.totalServed}
- Abandonment rate: ${analyticsData.abandonmentRate}
- Daily traffic: ${JSON.stringify(analyticsData.dailyTraffic)}

Provide 2-3 specific, actionable recommendations to improve queue efficiency and customer satisfaction. Focus on practical suggestions like staffing, timing, or process improvements.
  `;

  return await callOpenRouter(prompt, 300);
}

// Function 2: Predict Wait Time
export async function predictWaitTime(queueData, timeOfDay, dayOfWeek) {
  const prompt = `
Predict the wait time for a queue based on this data:

Current queue length: ${queueData.peopleInQueue}
Time of day: ${timeOfDay}
Day of week: ${dayOfWeek}
Queue category: ${queueData.category}
Location: ${queueData.location}

Based on typical patterns for ${queueData.category} businesses, predict the wait time in minutes. 
Consider:
- Peak hours
- Day of week
- Queue length
- Service speed

Respond with just a number (minutes) and a brief explanation.
  `;

  return await callOpenRouter(prompt, 100);
}

// Function 3: Generate Optimization Suggestions
export async function generateOptimizationSuggestions(queueMetrics) {
  const prompt = `
Analyze these queue metrics and suggest optimizations:

Metrics:
- Peak hours: ${queueMetrics.peakHours}
- Average service time: ${queueMetrics.avgServiceTime}
- Customer satisfaction: ${queueMetrics.satisfaction}
- Staff utilization: ${queueMetrics.staffUtilization}
- Abandonment rate: ${queueMetrics.abandonmentRate}

Provide 3 specific optimization strategies to improve efficiency and reduce wait times.
  `;

  return await callOpenRouter(prompt, 250);
}
