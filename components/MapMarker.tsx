import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { LatLng } from '../types';
import { CarIcon } from './icons';

interface MapMarkerProps {
  map: google.maps.Map;
  position: LatLng;
  type: 'pickup' | 'dropoff' | 'car' | 'current';
}

const MarkerIcon: React.FC<{ type: MapMarkerProps['type'] }> = ({ type }) => {
  switch (type) {
    case 'car':
      return (
          <div className="p-2 bg-black rounded-full shadow-lg">
            <CarIcon className="w-6 h-6 text-white" />
          </div>
      );
    case 'pickup':
      return (
        <div className="w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-md" />
      );
    case 'dropoff':
      return (
        <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md" />
      );
    case 'current':
        return (
          <div className="w-5 h-5 bg-cyan-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
        );
    default:
      return null;
  }
};

class CustomMapMarker extends google.maps.OverlayView {
    private position: google.maps.LatLng;
    private container: HTMLDivElement;
    private root: ReturnType<typeof createRoot>;

    constructor(position: google.maps.LatLng, content: React.ReactElement) {
        super();
        this.position = position;
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.root = createRoot(this.container);
        this.root.render(content);
    }
    
    onAdd() {
        this.getPanes()?.floatPane.appendChild(this.container);
    }

    onRemove() {
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.root.unmount();
    }

    draw() {
        const projection = this.getProjection();
        if (projection) {
            const point = projection.fromLatLngToDivPixel(this.position);
            if (point) {
                this.container.style.left = `${point.x - this.container.offsetWidth / 2}px`;
                this.container.style.top = `${point.y - this.container.offsetHeight / 2}px`;
            }
        }
    }

    setPosition(position: google.maps.LatLng) {
        this.position = position;
        this.draw();
    }
}

const MapMarker: React.FC<MapMarkerProps> = ({ map, position, type }) => {
    const markerRef = useRef<CustomMapMarker | null>(null);

    useEffect(() => {
        if (!markerRef.current) {
            markerRef.current = new CustomMapMarker(
                new google.maps.LatLng(position.lat, position.lng),
                <MarkerIcon type={type} />
            );
            markerRef.current.setMap(map);
        } else {
            markerRef.current.setPosition(new google.maps.LatLng(position.lat, position.lng));
        }

        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]); // Only create marker when map is ready

     useEffect(() => {
        if (markerRef.current) {
             markerRef.current.setPosition(new google.maps.LatLng(position.lat, position.lng));
        }
    }, [position]);


    return null;
};

export default MapMarker;
