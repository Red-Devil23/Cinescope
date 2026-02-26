import React from "react";

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrapper">
        <img src={movie.Poster} alt={movie.Title} />
        <span className="rating-badge">{movie.imdbRating}</span>
      </div>
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
    </div>
  );
}

export default MovieCard;


