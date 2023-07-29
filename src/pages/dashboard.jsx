import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Modal from '../components/Modal'

export default function Dashboard() {
  const [playlists, setPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token');
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getUserPlaylists().then((response) => {
      const playlists = response.body.items;
      Promise.all(
        playlists.map((playlist) =>
          spotifyApi.getPlaylistTracks(playlist.id).then((response) => ({
            ...playlist,
            tracks: response.body.items,
          }))
        )
      ).then(setPlaylists);
    });
  }, [accessToken]);

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    //<img src={playlist.images[0].url} alt={playlist.name} />
  };

  const closeModal = () => {
    setSelectedPlaylist(null);
  };

  function downloadPlaylist(playlist, format = 'txt') {
    let playlistData;
    if (format === 'csv') {
      playlistData = playlist.tracks
        .map((track) => `"${track.track.name}", "${track.track.artists.map(artist => artist.name).join(', ')}"`)
        .join('\n');
    } else {
      playlistData = playlist.tracks
        .map((track) => `${track.track.name} by ${track.track.artists.map(artist => artist.name).join(', ')}`)
        .join('\n');
    }
  
    const blob = new Blob([playlistData], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.download = `${playlist.name}.${format}`;
    link.href = url;
    link.click();
  
    URL.revokeObjectURL(url);
  }
  
  function downloadAllPlaylists(playlists, format = 'txt') {
    if (typeof window === 'undefined') return;
    
    let allPlaylistData;
    if (format === 'csv') {
      allPlaylistData = playlists.map(playlist => {
        const playlistData = playlist.tracks
          .map((track) => `"${playlist.name}", "${track.track.name}", "${track.track.artists.map(artist => artist.name).join(', ')}"`)
          .join('\n');
    
        return playlistData;
      }).join('\n');
    } else {
      allPlaylistData = playlists.map(playlist => {
        const playlistData = playlist.tracks
          .map((track) => `${track.track.name} by ${track.track.artists.map(artist => artist.name).join(', ')}`)
          .join('\n');
    
        return `Playlist: ${playlist.name}\nTracks:\n${playlistData}`;
      }).join('\n\n');
    }
  
    const blob = new Blob([allPlaylistData], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.download = `All_Playlists.${format}`;
    link.href = url;
    link.click();
  
    URL.revokeObjectURL(url);
  }
  
  

  return (
    <div className="min-h-screen bg-black py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:py-6 px-5 sm:px-6 mx-auto max-w-6xl">
        <button className="px-4 py-2 mb-4 text-black bg-green-600 rounded hover:bg-green-700 focus:outline-none" onClick={()=>downloadAllPlaylists(playlists, 'txt')}>Export to txt</button>
        <button className="px-4 py-2 mb-4 text-black bg-green-600 rounded hover:bg-green-700 focus:outline-none" onClick={()=>downloadAllPlaylists(playlists, 'csv')}>Export to csv</button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="shadow w-full bg-gray-800 rounded-md px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-700" onClick={()=>handlePlaylistClick(playlist)}>
              <img className="w-full h-48 object-cover mb-4 rounded-md" src={playlist.images[0]?.url} alt={playlist.name} />
              <h2 className="text-xl leading-6 font-inter text-white">{playlist.name}</h2>
            </div>
          ))}
        </div>
        {selectedPlaylist && (
          <Modal onClose={closeModal} playlist={selectedPlaylist} onDownload={(format) => downloadPlaylist(selectedPlaylist, format)} />
        )}
      </div>
    </div>
  );
}
