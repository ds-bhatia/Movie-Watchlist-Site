const API_KEY = 'a1d8edbd';
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const watchlist = document.getElementById('watchlist');
const USERS_KEY = 'users';

var watchlistMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
var users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

async function search(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();
    return data.Search || [];
}

function printSearch(movies) {
    searchResults.innerHTML = '';
    movies.forEach(function(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
            <button onclick="viewDetails('${movie.imdbID}')">View Details</button>
        `;
        searchResults.appendChild(movieCard);
    });
}

function addToWatchlist(imdbID) {
    if (!watchlistMovies.includes(imdbID)) {
        watchlistMovies.push(imdbID);
        localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
        alert('Added to watchlist!');
    }
}

async function printWatch() {
    if (!watchlist) return;
    watchlist.innerHTML = '';
    for (const imdbID of watchlistMovies) {
        const movie = await fetchMovieDetails(imdbID);
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
            <button onclick="viewDetails('${movie.imdbID}')">View Details</button>
        `;
        watchlist.appendChild(movieCard);
    }
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
}

function removeFromWatchlist(imdbID) {
    watchlistMovies = watchlistMovies.filter(function(id) {
        return id !== imdbID;
    });
    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
    printWatch();
}

async function press() {
        const query = searchInput.value.trim();
        if (query) {
            const movies = await search(query);
            printSearch(movies);
        }
}

printWatch();

function viewDetails(imdbID) {
    window.location.href = `details.html?imdbID=${imdbID}`;
}

async function printDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('imdbID');
    if (imdbID) {
        const movie = await fetchMovieDetails(imdbID);
        const movieDetails = document.getElementById('movie-details');
        if (movieDetails) {
            movieDetails.innerHTML = `
                <img src="${movie.Poster}">
                <h2>${movie.Title} (${movie.Year})</h2>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
            `;
        }
    }
}

if (window.location.pathname.endsWith('details.html')) {
    printDetails();
}

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(function(u) {
        return u.username === username && u.password === password;
    });

    if (user) {
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const userExists = users.some(function(u) {
        return u.username === username;
    });

    if (userExists) {
        document.getElementById('signup-error').style.display = 'block';
    } else {
        users.push({ username, password });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        document.getElementById('signup-success').style.display = 'block';
        document.getElementById('signup-error').style.display = 'none';
    }
});