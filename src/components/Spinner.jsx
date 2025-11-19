import React, { useEffect, useState } from "react";

const Spinner = ({ show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderTopColor: "var(--primary)",
            borderRightColor: "var(--primary-light)",
            borderBottomColor: "var(--primary-dark)",
            borderLeftColor: "transparent",
            boxShadow: "0 0 15px var(--primary), 0 0 25px var(--primary-light)",
            animation: "spin 1.8s linear infinite",
          }}
        ></div>

        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: "conic-gradient(var(--primary) 0%, var(--primary-light) 100%)",
            animation: "pulse 2s ease-in-out infinite alternate",
          }}
        ></div>

        <div
          className="absolute inset-8 w-4 h-4 rounded-full"
          style={{ backgroundColor: "var(--primary-dark)" }}
        ></div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0% { transform: scale(0.8); opacity: 0.7; }
              100% { transform: scale(1.2); opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default React.memo(Spinner);
