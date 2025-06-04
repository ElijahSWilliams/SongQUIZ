import { baseUrl } from "./Constants";

const handleSignIn = () => {
  console.log("Redirecting to backend /login route");
  window.location.href = `${baseUrl}/auth/login`; // Backend starts Spotify OAuth
};

const handleRedirect = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  try {
    const response = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      // Clean the URL
      window.history.replaceState({}, document.title, "/SongQUIZ/");

      return data;
    } else {
      console.error("Token exchange error:", data);
    }
  } catch (err) {
    console.error("Token fetch failed:", err);
  }
};

const checkForToken = () => {
  const token = localStorage.getItem("accessToken");
  return token ? token : null;
};

export { handleSignIn, handleRedirect, checkForToken };
