"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/forecast');
        const imageUrl = response.data.plot;
        console.log("Image url: ", response.data.plot)

        if (imageUrl) {
          setImageUrl(imageUrl);
        } else {
          console.error('No image URL received from the server');
        }
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      Hello bro
      {/* {imageUrl ? (
        <img
          src={imageUrl}
          alt="Balance Forecast"
          width={800}
          height={400}
        />
      ) : (
        <p>Loading...</p>
      )} */}
    </div>
  );
}
