import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { Location, LatLng } from '../types';
import MapMarker from './MapMarker';

interface MockMapProps {
  center?: LatLng | null;
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
  carLocation?: LatLng | null;
  routePath?: LatLng[];
  landmarks?: Location[];
  isAnimating?: boolean;
}

// Simple pseudo-random generator for deterministic "randomness"
const pseudoRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Function to convert LatLng to pixel coordinates within the map's bounds
const getScaleFunctions = (points: LatLng[], width: number, height: number, padding: number) => {
    if (points.length === 0 || width === 0 || height === 0) {
        return { scaleX: () => width / 2, scaleY: () => height / 2 };
    }

    const minLat = Math.min(...points.map(p => p.lat));
    const maxLat = Math.max(...points.map(p => p.lat));
    const minLng = Math.min(...points.map(p => p.lng));
    const maxLng = Math.max(...points.map(p => p.lng));

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    if (latRange < 1e-9 && lngRange < 1e-9) {
        return { scaleX: () => width / 2, scaleY: () => height / 2 };
    }

    const effectiveWidth = width - 2 * padding;
    const effectiveHeight = height - 2 * padding;

    const scale = Math.min(
        effectiveWidth / (lngRange || 1),
        effectiveHeight / (latRange || 1)
    );

    const offsetX = padding + (effectiveWidth - lngRange * scale) / 2;
    const offsetY = padding + (effectiveHeight - latRange * scale) / 2;

    return {
        scaleX: (lng: number) => (lng - minLng) * scale + offsetX,
        scaleY: (lat: number) => (maxLat - lat) * scale + offsetY,
    };
};

const AnimatedCityBackground: React.FC<{width: number; height: number; isAnimating: boolean}> = React.memo(({width, height, isAnimating}) => {
    const cityElements = useMemo(() => {
        if (width === 0 || height === 0) return { roads: [], buildings: [], traffic: [] };

        const roads = [];
        const buildings = [];
        const traffic = [];
        
        // Generate Roads
        for (let i = 0; i < 8; i++) {
            const seed = i * 1.1;
            if (pseudoRandom(seed) > 0.5) { // Vertical
                roads.push({ x1: pseudoRandom(seed + 1) * width, y1: 0, x2: pseudoRandom(seed + 2) * width, y2: height });
            } else { // Horizontal
                roads.push({ x1: 0, y1: pseudoRandom(seed + 3) * height, x2: width, y2: pseudoRandom(seed + 4) * height });
            }
        }

        // Generate Buildings
        for (let i = 0; i < 50; i++) {
            const seed = i * 2.2;
            buildings.push({
                x: pseudoRandom(seed + 5) * width,
                y: pseudoRandom(seed + 6) * height,
                w: pseudoRandom(seed + 7) * 40 + 20,
                h: pseudoRandom(seed + 8) * 40 + 20,
            });
        }
        
        // Generate Animated Traffic
        for (let i = 0; i < 10; i++) {
            const seed = i * 3.3;
            const startX = pseudoRandom(seed+9) * width;
            const startY = pseudoRandom(seed+10) * height;
            const endX = pseudoRandom(seed+11) * width;
            const endY = pseudoRandom(seed+12) * height;

            traffic.push({
                path: `M${startX},${startY} L${endX},${endY}`,
                duration: `${pseudoRandom(seed+13) * 10 + 10}s`, // 10-20s duration
                delay: `-${pseudoRandom(seed+14) * 20}s`, // Random start time
            });
        }

        return { roads, buildings, traffic };
    }, [width, height]);

    return (
        <svg width="100%" height="100%" className="absolute inset-0">
            <g className="roads">
                {cityElements.roads.map((road, i) => (
                    <line key={i} {...road} className="stroke-gray-300/80 dark:stroke-gray-700/60" strokeWidth="1" />
                ))}
            </g>
            <g className="buildings">
                {cityElements.buildings.map((b, i) => (
                    <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} className="fill-gray-300/70 dark:fill-gray-700/50" rx="2" />
                ))}
            </g>
             {isAnimating && (
                <g className="traffic">
                    {cityElements.traffic.map((t, i) => (
                        <circle key={i} r="2" className="fill-gray-400 dark:fill-gray-500 opacity-70">
                            <animateMotion
                                dur={t.duration}
                                repeatCount="indefinite"
                                path={t.path}
                                begin={t.delay}
                            />
                        </circle>
                    ))}
                </g>
            )}
        </svg>
    );
});


const MockMap: React.FC<MockMapProps> = ({ 
    center, 
    pickup, 
    dropoff, 
    carLocation, 
    routePath = [], 
    landmarks = [],
    isAnimating = false,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (mapRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries[0]) {
                    const { width, height } = entries[0].contentRect;
                    setDimensions({ width, height });
                }
            });
            resizeObserver.observe(mapRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const allPoints = useMemo(() => {
        const points: LatLng[] = [];
        if (center) points.push(center);
        if (pickup) points.push(pickup);
        if (dropoff) points.push(dropoff);
        if (carLocation) points.push(carLocation);
        points.push(...landmarks);
        points.push(...routePath);
        
        if (points.length === 1) {
            points.push({ lat: points[0].lat + 0.001, lng: points[0].lng + 0.001 });
        }
        
        // Handle case with no points
        if (points.length === 0) {
            points.push({lat: 0, lng: 0}, {lat: 0.01, lng: 0.01});
        }

        return points;
    }, [center, pickup, dropoff, carLocation, routePath, landmarks]);

    const { scaleX, scaleY } = getScaleFunctions(allPoints, dimensions.width, dimensions.height, 80);
    
    const routePoints = useMemo(() => {
        return routePath.map(p => `${scaleX(p.lng)},${scaleY(p.lat)}`).join(' ');
    }, [routePath, scaleX, scaleY]);

    return (
        <div ref={mapRef} className="w-full h-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
            <style>{`
                @keyframes pulse-slow {
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
            
            <AnimatedCityBackground width={dimensions.width} height={dimensions.height} isAnimating={isAnimating} />
            
            <div className="relative w-full h-full">
                {/* Route */}
                {routePath.length > 0 && (
                     <svg width="100%" height="100%" className="absolute inset-0">
                        <polyline points={routePoints} fill="none" className="stroke-cyan-800/30 dark:stroke-cyan-500/30" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points={routePoints} fill="none" className="stroke-cyan-600 dark:stroke-cyan-400" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}

                {/* Markers */}
                {landmarks.map(landmark => (
                    <div key={landmark.address} style={{position: 'absolute', left: scaleX(landmark.lng) - 10, top: scaleY(landmark.lat) - 20}}>
                        <MapMarker type="landmark" />
                    </div>
                ))}
                {pickup && <div style={{position: 'absolute', left: scaleX(pickup.lng) - 6, top: scaleY(pickup.lat) - 6}}><MapMarker type="pickup"/></div>}
                {dropoff && <div style={{position: 'absolute', left: scaleX(dropoff.lng) - 6, top: scaleY(dropoff.lat) - 6}}><MapMarker type="dropoff"/></div>}
                {carLocation && <div style={{position: 'absolute', left: scaleX(carLocation.lng) - 16, top: scaleY(carLocation.lat) - 16, transition: 'left 100ms linear, top 100ms linear'}}><MapMarker type="car"/></div>}
                {center && !pickup && landmarks.length === 0 && <div style={{position: 'absolute', left: scaleX(center.lng) - 8, top: scaleY(center.lat) - 8}}><MapMarker type="current"/></div>}
            </div>
        </div>
    );
};

export default MockMap;