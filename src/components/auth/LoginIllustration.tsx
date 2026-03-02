import React from "react";

export function LoginIllustration() {
  return (
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-screen">
      <style>
        {`
          .paper { animation: drawPaper 8s infinite ease-out; }
          .step1 { animation: drawStep1 8s infinite ease-out; }
          .step2 { animation: drawStep2 8s infinite ease-out; }
          .step3 { animation: drawStep3 8s infinite ease-out; }
          .step4 { animation: drawStep4 8s infinite ease-out; }
          .step5 { animation: drawStep5 8s infinite ease-out; }
          .cursor { animation: moveCursor 8s infinite ease-in-out; }

          @keyframes drawPaper {
            0%, 5% { opacity: 0; transform: translateY(20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
            95%, 100% { opacity: 0; transform: translateY(-20px); }
          }
          
          @keyframes drawStep1 {
            0%, 15% { opacity: 0; transform: scale(0.8); transform-origin: 280px 120px; }
            18%, 90% { opacity: 1; transform: scale(1); }
            95%, 100% { opacity: 0; }
          }
          
          @keyframes drawStep2 {
            0%, 25% { opacity: 0; transform: translateX(-10px); }
            28%, 90% { opacity: 1; transform: translateX(0); }
            95%, 100% { opacity: 0; }
          }
          
          @keyframes drawStep3 {
            0%, 35% { opacity: 0; transform: translateX(-10px); }
            38%, 90% { opacity: 1; transform: translateX(0); }
            95%, 100% { opacity: 0; }
          }
          
          @keyframes drawStep4 {
            0%, 45% { opacity: 0; transform: translateX(-10px); }
            48%, 90% { opacity: 1; transform: translateX(0); }
            95%, 100% { opacity: 0; }
          }
          
          @keyframes drawStep5 {
            0%, 55% { opacity: 0; transform: translateX(-10px); }
            58%, 90% { opacity: 1; transform: translateX(0); }
            95%, 100% { opacity: 0; }
          }
          
          @keyframes moveCursor {
            0%, 5% { transform: translate(400px, 300px); opacity: 0; }
            10% { transform: translate(400px, 300px); opacity: 1; }
            15% { transform: translate(290px, 130px); }
            25% { transform: translate(420px, 115px); }
            35% { transform: translate(350px, 240px); }
            45% { transform: translate(350px, 350px); }
            55% { transform: translate(350px, 445px); }
            75%, 90% { transform: translate(450px, 500px); opacity: 1; }
            95%, 100% { opacity: 0; }
          }
          
          .svg-text { font-family: Helvetica, Arial, sans-serif; font-weight: bold; }
        `}
      </style>

      <rect width="100%" height="100%" fill="#F2F3F4" />

      <g className="paper">
        <rect x="204" y="54" width="392" height="492" rx="10" fill="rgba(10,12,41,0.05)" />
        <rect x="200" y="50" width="400" height="500" rx="10" fill="#EBE8D8" stroke="#1C3F3A" strokeWidth="2" />

        <g className="step1">
          <circle cx="280" cy="120" r="35" fill="#1C3F3A" />
          <path d="M280 105 A 12 12 0 1 0 280 129 A 12 12 0 1 0 280 105 Z M260 145 C 260 130, 270 125, 280 125 C 290 125, 300 130, 300 145" fill="#EBE8D8" />
        </g>

        <g className="step2">
          <rect x="335" y="100" width="180" height="18" rx="4" fill="#0A0C29" />
          <rect x="335" y="128" width="120" height="12" rx="4" fill="#1C3F3A" />
        </g>

        <g className="step3">
          <text x="245" y="200" fontSize="14" fill="#1C3F3A" letterSpacing="1" className="svg-text">EXPERIENCE</text>
          <rect x="245" y="210" width="310" height="10" rx="3" fill="#0A0C29" />
          <rect x="245" y="230" width="280" height="10" rx="3" fill="#0A0C29" />
          <rect x="245" y="250" width="290" height="10" rx="3" fill="#0A0C29" />
          <rect x="245" y="270" width="150" height="10" rx="3" fill="#0A0C29" />
        </g>

        <g className="step4">
          <text x="245" y="320" fontSize="14" fill="#1C3F3A" letterSpacing="1" className="svg-text">EDUCATION</text>
          <rect x="245" y="330" width="260" height="10" rx="3" fill="#0A0C29" />
          <rect x="245" y="350" width="220" height="10" rx="3" fill="#0A0C29" />
          <rect x="245" y="370" width="180" height="10" rx="3" fill="#0A0C29" />
        </g>

        <g className="step5">
          <text x="245" y="420" fontSize="14" fill="#1C3F3A" letterSpacing="1" className="svg-text">SKILLS</text>
          <rect x="245" y="435" width="70" height="24" rx="12" fill="#E0EAE8" stroke="#1C3F3A" strokeWidth="1.5" />
          <rect x="325" y="435" width="90" height="24" rx="12" fill="#E0EAE8" stroke="#1C3F3A" strokeWidth="1.5" />
          <rect x="425" y="435" width="60" height="24" rx="12" fill="#E0EAE8" stroke="#1C3F3A" strokeWidth="1.5" />
          <rect x="495" y="435" width="60" height="24" rx="12" fill="#E0EAE8" stroke="#1C3F3A" strokeWidth="1.5" />
        </g>
      </g>

      <g className="cursor">
        <path d="M0,0 L11,28 L16,16 L28,11 Z" fill="#0A0C29" stroke="#fff" strokeWidth="2" />
      </g>
    </svg>
  );
}
