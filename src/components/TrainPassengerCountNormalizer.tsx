"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api/client";

export default function TrainPassengerCountNormalizer() {
  useEffect(() => {
    const interceptor = apiClient.interceptors.request.use((config) => {
      if (config.url === "/api/bookings/train-ticket-booking/" && config.data && !config.data.number_of_passengers) {
        config.data.number_of_passengers = Array.isArray(config.data.guests) ? config.data.guests.length : 1;
      }
      return config;
    });

    return () => apiClient.interceptors.request.eject(interceptor);
  }, []);

  return null;
}
