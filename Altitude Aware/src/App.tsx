import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/images/logo.png";

function App() {
  const [altitude, setAltitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getAltitude = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setAltitude(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`
          );
          const json = await res.json();

          if (json.results && json.results.length > 0) {
            const elevation = json.results[0].elevation;
            setAltitude(elevation);
            getBodyEffects(elevation);
          } else {
            setError("Unable to retrieve altitude data");
          }
        } catch (err) {
          setError("Something went wrong while fetching altitude");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message || "Location access denied.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const getBodyEffects = (altitude: number) => {
    if (altitude < 1500)
      setMessage("You're at a safe altitude. No significant effects.");
    else if (altitude < 2500)
      setMessage("You may feel slight breathlessness during intense activity.");
    else if (altitude < 3500)
      setMessage("Altitude sickness is possible. Acclimatization is advised.");
    else
      setMessage(
        "Acute mountain sickness is likely. Seek medical attention if symptoms occur."
      );
  };

  return (
    <>
      <header className="flex justify-center items-center h-20 shadow-md bg-white">
        <a href="#">
          <img className="w-40" src={logo} alt="" />
        </a>
      </header>
      <main className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-8">
          {loading && <p className="text-lg text-gray-700">Loading...</p>}
          {error && <p className="text-lg text-red-500">{error}</p>}
          {altitude !== null && (
            <p className="text-lg text-gray-700">
              Your altitude is: {altitude} meters
            </p>
          )}
        </div>
        {message ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-8">
            <strong className="font-bold">Altitude Effects:</strong>
            <span className="block sm:inline">{message}</span>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl text-center font-bold mb-4">Hi!</h1>
            <p className="text-lg text-center text-gray-700 mb-8">
              This is a simple app to check your altitude and inform you about{" "}
              <br /> the physical conditions that your body may experience.
            </p>
          </div>
        )}

        <button
          id="get-location"
          className="cursor-pointer animate-pulse hover:scale-110 bg-blue-500 w-24 h-24 rounded-[50%] text-white transition-all duration-300"
          onClick={() => {
            getAltitude();
          }}
        >
          Get your altitude
        </button>
      </main>
    </>
  );
}

export default App;
