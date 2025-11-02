// IMPORTANT: This key is for Google Maps, not Gemini.
// In a real app, you'd get this from your Google Cloud Console.
// For this environment, we'll assume it's available as a separate env var.
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (): Promise<void> => {
    if (scriptLoaded) {
        return Promise.resolve();
    }
    if (scriptPromise) {
        return scriptPromise;
    }

    if (!GOOGLE_MAPS_API_KEY) {
        console.error("Google Maps API Key is not set. Map features will be disabled.");
        return Promise.reject("Google Maps API Key not available.");
    }

    scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            scriptLoaded = true;
            scriptPromise = null;
            resolve();
        };
        script.onerror = () => {
            scriptPromise = null;
            reject(new Error('Google Maps script could not be loaded.'));
        };
        document.head.appendChild(script);
    });

    return scriptPromise;
};

interface DirectionsResult {
    path: google.maps.LatLng[];
    startLocation: google.maps.LatLng;
    endLocation: google.maps.LatLng;
}

export const getDirections = (origin: string, destination: string): Promise<DirectionsResult | null> => {
    return new Promise((resolve) => {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps not initialized.");
            resolve(null);
            return;
        }

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result && result.routes.length > 0) {
                    const route = result.routes[0];
                    if (route.overview_path.length > 0) {
                        resolve({
                            path: route.overview_path,
                            startLocation: route.legs[0].start_location,
                            endLocation: route.legs[0].end_location,
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    console.error(`Directions request failed due to ${status}`);
                    resolve(null);
                }
            }
        );
    });
};
