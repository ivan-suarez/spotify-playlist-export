import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

export default function Dashboard() {
  const [playlists, setPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token');
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    spotifyApi.getUserPlaylists().then((response) => {
      setPlaylists(response.body.items);
    });
  }, [accessToken]);

  return (
    <div>
      {playlists.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </div>
  );
}
