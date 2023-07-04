

export default function Home() {
  const login = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=playlist-modify-public`;
  };
  return (
    <main>Hello world
      <button onClick={login}>Login</button>
    </main>
  )
  
}
