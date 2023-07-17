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

  function downloadPlaylist(playlist) {
    const playlistData = playlist.tracks
      .map((track) => `${track.track.name} by ${track.track.artists.map(artist => artist.name).join(', ')}`)
      .join('\n');
  
    const blob = new Blob([playlistData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.download = `${playlist.name}.txt`;
    link.href = url;
    link.click();
  
    URL.revokeObjectURL(url);
  }

  
  function downloadAllPlaylists(playlists) {

    if (typeof window === 'undefined') return;
    const allPlaylistData = playlists.map(playlist => {
      const playlistData = playlist.tracks
        .map((track) => `${track.track.name} by ${track.track.artists.map(artist => artist.name).join(', ')}`)
        .join('\n');
  
      return `Playlist: ${playlist.name}\nTracks:\n${playlistData}`;
    }).join('\n\n');
  
    const blob = new Blob([allPlaylistData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.download = `All_Playlists.txt`;
    link.href = url;
    link.click();
  
    URL.revokeObjectURL(url);
  }
  

  return (
    <div>
      <button onClick={()=>downloadAllPlaylists(playlists)}>Download everything</button>
      {playlists.map((playlist) => (
        <div key={playlist.id} onClick={()=>handlePlaylistClick(playlist)}>
          <h2>{playlist.name}</h2>
          
          
        </div>
      ))}
     {selectedPlaylist && (
  <Modal onClose={closeModal} playlist={selectedPlaylist} onDownload={() => downloadPlaylist(selectedPlaylist)} />
)}
    </div>
  );
}
