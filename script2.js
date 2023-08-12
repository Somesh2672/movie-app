document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const searchInput = document.getElementById('search');
  const findMovieButton = document.getElementById('findMovie');
  const movieCardContainer = document.querySelector('.movieCard');
  const movieDetailTemplate = document.getElementById('movieDetail');

  findMovieButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const searchQuery = searchInput.value.trim();

    if (apiKey === '' || searchQuery === '') {
      return;
    }

    const omdbApiUrl = `https://www.omdbapi.com/?i=tt3896198&s=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`;

    movieCardContainer.innerHTML = ''; // Clear previous results

    // Show spinning loader
    const loader = document.createElement('div');
    loader.className = 'loader';
    movieCardContainer.appendChild(loader);

    fetch(omdbApiUrl)
      .then(response => response.json())
      .then(data => {
        movieCardContainer.removeChild(loader); // Remove spinning loader

        if (data.Response === 'True') {
          const movies = data.Search;
          movies.forEach(movie => {
            const movieDetailClone = movieDetailTemplate.content.cloneNode(true);
            const thumbnail = movieDetailClone.querySelector('.thumbnail img');
            const nameNum = movieDetailClone.querySelector('.nameNum');
            
            thumbnail.src = movie.Poster === 'N/A' ? 'media/default-movie-poster.png' : movie.Poster;
            nameNum.querySelector('h1').textContent = movie.Year.slice(-2);
            nameNum.querySelector('p').textContent = movie.Title ;
            const imdbLink = `https://www.imdb.com/title/${movie.imdbID}`;
            //nameNum.innerHTML += `<a href="${imdbLink}" target="_blank" class="imdbLink">More Details</a>`;

            movieCardContainer.appendChild(movieDetailClone);
          });
        } else {
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error';
          errorMessage.textContent = data.Error;
          movieCardContainer.appendChild(errorMessage);
        }
      })
      .catch(error => {
        movieCardContainer.removeChild(loader); // Remove spinning loader
        console.error('An error occurred:', error);
      });
  });
});
