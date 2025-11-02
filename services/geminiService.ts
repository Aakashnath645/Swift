import { GoogleGenAI, Type } from "@google/genai";
import { Driver, Location, RideOption, ChatMessage, LatLng } from "../types";
import { mockLandmarks } from "../constants";

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // Here, we'll alert and allow the UI to function without Gemini features.
  alert("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const calculateFare = async (
    pickup: Location,
    dropoff: Location,
    ride: RideOption,
    driver: Driver
): Promise<{ fare: number; distance: string; reasoning: string; eta: number }> => {
    const isBike = ride.name.toLowerCase().includes('bike');
    
    const vehicleInfo = isBike
      ? `- Ride Type: "${ride.name}" (A quick, eco-friendly bike ride)`
      : `- Ride Type: "${ride.name}" (${ride.description})\n- Vehicle: "${driver.vehicleModel}"`;

    const fareInstructions = isBike
      ? `For fare: Use a base fare of ₹20, a per-kilometer rate of ₹8, and a per-minute rate of ₹1. A bike is faster in traffic, so adjust ETA accordingly.`
      : `For fare: Use a base fare of ₹50, a per-kilometer rate of ₹12, and a per-minute rate of ₹2. Apply the ride type multiplier of ${ride.multiplier}.`;

    const prompt = `
        Act as a ride-sharing fare and ETA calculator for India.
        Calculate the estimated fare in Indian Rupees (₹) and the estimated time of arrival (ETA) in minutes for a trip with the following details:
        - Pickup: "${pickup.address}"
        - Destination: "${dropoff.address}"
        ${vehicleInfo}

        Consider the following for your calculations:
        1.  Estimate the distance in kilometers.
        2.  Assume potential urban traffic, which might affect travel time.
        3.  ${fareInstructions}
        4.  For ETA: Estimate total travel time in minutes.
        5.  Provide a brief, one-sentence reasoning for the final price.

        Return the result as a JSON object with the exact keys "fare" (number), "distance" (string, e.g., "15 km"), "reasoning" (string), and "eta" (number, in minutes).
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
                        eta: { type: Type.NUMBER },
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
            eta: data.eta || 10, // Fallback ETA
        };

    } catch (error) {
        console.error("Error calculating fare with Gemini:", error);
        // Fallback calculation if API fails
        const fallbackFare = (250 * ride.multiplier) + (Math.random() * 50);
        return {
            fare: parseFloat(fallbackFare.toFixed(2)),
            distance: "approx. 8-11 km",
            reasoning: "Could not connect to the live pricing model.",
            eta: Math.floor(Math.random() * 5 + 8), // Random ETA between 8 and 13 mins
        };
    }
};


export const getDriverResponse = async (userMessage: string, driverName: string, chatHistory: ChatMessage[]): Promise<string> => {
    const historyContext = chatHistory.map(msg => `${msg.sender === 'user' ? 'Passenger' : 'You'}: ${msg.text}`).join('\n');

    const prompt = `
      You are a friendly and professional ride-share driver named ${driverName}. You are currently driving a passenger. 
      The passenger has sent you a message. Respond to them in a brief, helpful, and natural way, as if you are quickly replying while driving safely.
      Keep your responses very short (1-2 sentences).

      Conversation so far:
      ${historyContext}

      New message from passenger: "${userMessage}"

      Your response:
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting driver response from Gemini:", error);
        return "Sorry, I can't talk right now, focusing on the road!";
    }
};

export const getPlaceSuggestions = async (location: LatLng): Promise<Location[]> => {
    const prompt = `
        Based on the user's current location (Latitude: ${location.lat}, Longitude: ${location.lng}), suggest 6 interesting and popular places to visit nearby.
        Include a mix of landmarks, restaurants, and parks relevant to the area.
        Return the result as a JSON array where each object has the exact keys "address" (string, full name of the place), "lat" (number), and "lng" (number).
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            address: { type: Type.STRING },
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER },
                        },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data;

    } catch (error) {
        console.error("Error getting place suggestions from Gemini:", error);
        // Fallback to mock data if the API call fails
        return mockLandmarks;
    }
}