import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Notification component
 * Props:
 * - message: string (content)
 * - bgColor: css color for background
 * - textColor: css color for text
 * - duration: ms before auto-close (0 = persistent)
 * - onClose: callback when closed
 */
const Notification = ({ message, bgColor, textColor, duration = 4000, onClose }) => {
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="notification"
      style={{
        position: 'fixed',
        right: 20,
        top: 20,
        zIndex: 60,
        minWidth: 260,
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        background: bgColor || 'var(--primary)',
        color: textColor || 'var(--text-inverse)',
        fontWeight: 600,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>{message}</div>
        <button
          onClick={() => onClose && onClose()}
          aria-label="Fermer la notification"
          style={{
            background: 'transparent',
            border: 'none',
            color: textColor || 'var(--text-inverse)',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default Notification;
