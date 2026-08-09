"use client";

import type { ReactNode } from "react";
import HotelImagePlaceholderController from "@/components/HotelImagePlaceholderController";

export default function HotelReservationsTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <HotelImagePlaceholderController />
      <style>{`
        [data-hotel-image-placeholder="true"] > img {
          display: none;
        }

        [data-hotel-image-placeholder="true"]::before {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(135deg, #eef7fc 0%, #dceef7 100%);
        }

        [data-hotel-image-placeholder="true"]::after {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 4.5rem;
          height: 4.5rem;
          content: "";
          transform: translate(-50%, -50%);
          border: 1px solid rgba(8, 125, 189, 0.16);
          border-radius: 1.5rem;
          background-color: rgba(255, 255, 255, 0.72);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23087dbd' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 22v-6.57'/%3E%3Cpath d='M12 11h.01'/%3E%3Cpath d='M12 7h.01'/%3E%3Cpath d='M14 15.43V22'/%3E%3Cpath d='M15 16a5 5 0 0 0-6 0'/%3E%3Cpath d='M16 11h.01'/%3E%3Cpath d='M16 7h.01'/%3E%3Cpath d='M8 11h.01'/%3E%3Cpath d='M8 7h.01'/%3E%3Crect width='16' height='20' x='4' y='2' rx='2' ry='2'/%3E%3C/svg%3E");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 2rem 2rem;
          box-shadow: 0 1px 2px rgba(6, 31, 59, 0.08);
        }
      `}</style>
    </>
  );
}
