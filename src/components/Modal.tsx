import React, { useEffect, ReactNode, FunctionComponent } from 'react';

interface Artist {
  name: string;
}

interface Track {
  id: string;
  track: {
    name: string;
    artists: Artist[];
  };
}

interface Playlist {
  name: string;
  tracks: Track[];
}

interface ModalProps {
  children?: ReactNode;
  onClose: () => void;
  playlist: Playlist;
  onDownload: (format: string) => void;
}

const Modal: FunctionComponent<ModalProps> = ({ onClose, playlist, onDownload }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative bg-black p-8 m-4 rounded-lg text-white max-h-screen overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4">{playlist.name}</h2>
        <button className="px-4 py-2 rounded text-black bg-green-600 hover:bg-green-500 mb-4" onClick={() => onDownload('txt')}>Download as TXT</button>
        <button className="px-4 py-2 rounded text-black bg-green-600 hover:bg-green-500 mb-4" onClick={() => onDownload('csv')}>Download as CSV</button>
        <ol className="list-decimal list-inside">
          {playlist.tracks.map((track) => (
            <li key={track.id} className="my-1">
              <div>{track.track.name}</div>
              <div className="text-sm">{track.track.artists.map(artist => artist.name).join(', ')}</div>
            </li>
          ))}
        </ol>
        <button className="absolute top-2 right-2 text-white hover:text-red-500" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
