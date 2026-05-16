'use client';

import React from 'react';
import Image from 'next/image';

export function ELLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <style>{`
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 5px 15px rgba(6, 182, 212, 0.2));
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            filter: drop-shadow(0 25px 25px rgba(6, 182, 212, 0.4));
          }
        }

        @keyframes progressLine {
          0% {
            width: 0%;
            left: 0%;
          }
          50% {
            width: 100%;
            left: 0%;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }

        .loader-logo {
          animation: logoFloat 3s ease-in-out infinite;
        }

        .progress-bar-container {
          width: 200px;
          height: 4px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          margin-top: 40px;
        }

        .progress-bar-fill {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #06b6d4, #3b82f6, #a855f7);
          animation: progressLine 2s ease-in-out infinite;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loader-text {
          margin-top: 24px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          animation: pulseOpacity 2s ease-in-out infinite;
        }

        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="loader-container">
        <div className="loader-logo relative w-48 h-24 sm:w-64 sm:h-32">
          <Image
            src="/logo.png"
            alt="EL SPACE"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar-fill" />
        </div>

        <p className="loader-text">Initializing EL SPACE</p>
      </div>
    </div>
  );
}

export function ELLoaderSmall() {
  return (
    <div className="flex items-center justify-center">
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .small-loader-ring {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #06b6d4;
          border-radius: 50%;
          animation: spinSlow 1s linear infinite;
        }
      `}</style>
      <div className="small-loader-ring" />
    </div>
  );
}
