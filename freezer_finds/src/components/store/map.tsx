'use client';

import { useEffect, useState } from 'react';

interface MapProps {
  address: string;
  city: string;
  state: string;
}
export default function Map({ address, city, state }: MapProps) {
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(address)}&city=${encodeURIComponent(
          city
        )}&state=${encodeURIComponent(state)}&format=json&limit=1`
      );
      const data = await res.json();
      console.log('Apparently this is coords:', data);
      if (data && data.length > 0) {
        setCoords({ lat: data[0].lat, lon: data[0].lon });
      }
    };
    fetchCoords();
  }, [address, city, state]);

  if (!coords) return <p>Loading map for “{address}”...</p>;

  const { lat, lon } = coords;
  const bbox = `${Number(lon) - 0.02},${Number(lat) - 0.02},${Number(lon) + 0.02},${Number(lat) + 0.02}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <iframe
      width="100%"
      height="300"
      frameBorder="0"
      scrolling="no"
      src={mapUrl}
      style={{ borderRadius: '12px' }}></iframe>
  );
}
