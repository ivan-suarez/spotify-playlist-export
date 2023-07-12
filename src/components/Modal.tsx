import React, { useEffect } from 'react';

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'black',
          padding: '1em',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
