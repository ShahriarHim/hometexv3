import { useState, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated';

const useGeolocation = () => {
    const [location, setLocation] = useState('Location');
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        if (coords) {
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
            )
                .then((response) => response.json())
                .then((data) => setLocation(data.address.city || 'Unknown Location'))
                .catch(() => setLocation('Unknown Location'));
        }
    }, [coords]);

    return { location, isGeolocationAvailable, isGeolocationEnabled };
};

export default useGeolocation;
