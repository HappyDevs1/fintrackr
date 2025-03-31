"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ForecastPlot() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/forecast');
        
        if (response.data?.plot) {
          setImageSrc(response.data.plot);
        } else {
          throw new Error('No plot data received');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading forecast...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Balance Forecast"
          className="w-full max-w-3xl mx-auto"
          width={800}
          height={400}
        />
      ) : (
        <div>No forecast data available</div>
      )}
    </div>
  );
}