import { GoogleGenAI, Type } from "@google/genai";
import { Driver, Location, RideOption } from "../types";

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // Here, we'll alert and allow the UI to function without Gemini features.
  alert("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findNearbyPlaces = async (
  query: string,
  location: { latitude: number; longitude: number }
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${query} near me.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      places: groundingChunks,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: "Sorry, I couldn't find any places right now. Please try again later.",
      places: [],
    };
  }
};


export const calculateFare = async (
    pickup: Location,
    dropoff: Location,
    ride: RideOption,
    driver: Driver
): Promise<{ fare: number; distance: string; reasoning: string }> => {
    const prompt = `
        Act as a ride-sharing fare calculator.
        Calculate the estimated fare for a trip with the following details:
        - Pickup: "${pickup.address}"
        - Destination: "${dropoff.address}"
        - Ride Type: "${ride.name}" (${ride.description})
        - Vehicle: "${driver.vehicleModel}"

        Consider the following:
        1.  Estimate the distance between the pickup and destination.
        2.  Factor in a base fare of $2.50.
        3.  Use a per-mile rate of $1.75.
        4.  Use a per-minute rate of $0.30 (assume an average speed of 25 mph for travel time).
        5.  Apply the ride type multiplier of ${ride.multiplier}.
        6.  Consider the vehicle model for a slight fuel efficiency adjustment (e.g., a Prius is cheaper to run than an XL vehicle).
        7.  Provide a brief, one-sentence reasoning for the final price.

        Return the result as a JSON object with the exact keys "fare" (number), "distance" (string), and "reasoning" (string).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fare: { type: Type.NUMBER },
                        distance: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        return {
            fare: data.fare,
            distance: data.distance,
            reasoning: data.reasoning,
        };

    } catch (error) {
        console.error("Error calculating fare with Gemini:", error);
        // Fallback calculation if API fails
        const fallbackFare = (12.5 * ride.multiplier) + (Math.random() * 5);
        return {
            fare: parseFloat(fallbackFare.toFixed(2)),
            distance: "approx. 5-7 miles",
            reasoning: "Could not connect to the live pricing model.",
        };
    }
};
