import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";

const API_KEY = import.meta.env.VITE_OMDB_KEY;

// Map genres to generic keywords for OMDb search
const genreKeywords = {
  Action: "action",
  Comedy: "comedy",
  Horror: "horror",
  Romance: "romance",
  "Sci-Fi": "sci-fi",
  Fantasy: "fantasy",
  Drama: "drama",
  Thriller: "thriller",
};

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initial fetch
  useEffect(() => {
    fetchMovies("2024"); // default year
    document.documentElement.className = "genre-default";
  }, []);

  // Fetch movies when genre changes
  useEffect(() => {
    const className =
      genre === "All" ? "genre-default" : `genre-${genre.toLowerCase()}`;
    document.documentElement.className = className;

    if (genre === "All") {
      fetchMovies("2024");
    } else {
      fetchMovies(genreKeywords[genre]);
    }
  }, [genre]);

  // Fetch movies from OMDb
  const fetchMovies = async (keyword) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://www.omdbapi.com/?s=${keyword}&type=movie&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        // Fetch full details for each movie
        const detailed = await Promise.all(
          data.Search.slice(0, 8).map(async (movie) => {
            const r = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`
            );
            return await r.json();
          })
        );

        // Filter out movies without poster
        const validMovies = detailed.filter(
          (m) => m.Poster && m.Poster !== "N/A"
        );

        setMovies(validMovies);
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = () => {
    if (!search.trim()) return;
    fetchMovies(search);
  };

  // Fetch full details when clicking a movie card
  const handleMovieClick = async (imdbID) => {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
    );
    const data = await res.json();
    setSelectedMovie(data);
  };

  return (
    <div className="app">
      <h1 className="logo">🎬 CineScope</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Genre Dropdown */}
      <div className="genre-filter">
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="All">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Drama">Drama</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Movie Grid */}
      <div className="movie-list">
        {movies
  .filter(movie => movie.Poster && movie.Poster !== "N/A")
  .map(movie => (
    <MovieCard
      key={movie.imdbID}
      movie={movie}
      onClick={() => setSelectedMovie(movie)}
    />
))}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
    
  );
}

export default App;