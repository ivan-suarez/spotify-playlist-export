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

  return (
    <div>
      {playlists.map((playlist) => (
        <div key={playlist.id} onClick={()=>handlePlaylistClick(playlist)}>
          <h2>{playlist.name}</h2>
          
          
        </div>
      ))}
     {selectedPlaylist && (
        <Modal onClose={closeModal}>
          <h2>{selectedPlaylist.name}</h2>
          <ol>
            {selectedPlaylist.tracks.map((track) => (
              <li key={track.id}>{track.track.name}</li>
            ))}
          </ol>
        </Modal>
      )}
    </div>
  );
}
