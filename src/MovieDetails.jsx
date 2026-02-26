function MovieDetails({ movie, onClose }) {
  if (!movie) return null;

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    movie.Title + " official trailer"
  )}`;

  return (
    // CLICKING OUTSIDE closes the modal
    <div className="movie-details-overlay" onClick={onClose}>
      
      {/* Clicking INSIDE the modal does NOT close it */}
      <div className="movie-details" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>✖</button>

        <img className="poster" src={movie.Poster} alt={movie.Title} />

        <h2>{movie.Title}</h2>

        <p><strong>Release Date:</strong> {movie.Released}</p>
        <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
        <p><strong>Overview:</strong> {movie.Plot}</p>

        <a
          className="trailer-btn"
          href={trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶ Watch Trailer
        </a>
      </div>
    </div>
  );
}

export default MovieDetails;





