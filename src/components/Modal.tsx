import React, { useEffect } from 'react';

const Modal = ({ children, onClose, playlist, onDownload }) => {
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
        <h2>{playlist.name}</h2>
        <button onClick={onDownload}>Download Playlist</button>
        <ol>
          {playlist.tracks.map((track) => (
            <li key={track.id}>{track.track.name}</li>
          ))}
        </ol>
        <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
