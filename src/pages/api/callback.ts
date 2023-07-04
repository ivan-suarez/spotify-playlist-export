import axios from 'axios';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-node';

export default async function handler(req, res) {
  const code = req.query.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    res.redirect(`/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (err) {
    console.log('Something went wrong!', err);
    res.redirect('/?error=Something went wrong!');
  }
}
