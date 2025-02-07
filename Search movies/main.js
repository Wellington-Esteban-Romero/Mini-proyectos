'use strict'

const YOUR_API_KEY = "bb9571fd"
const KEY_TXT_MOVIE = "searchTxt"

var query = document.getElementById('searchInput');
const btnSearch = document.querySelector('.btn-primary');


window.addEventListener('load', (event) => {
    query.value = localStorage.getItem(KEY_TXT_MOVIE) || "";
});

query.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        setItemSearchTxt()
        searchMovie()
    }
});

btnSearch.addEventListener('click', (e) => {
    setItemSearchTxt()
    searchMovie()
});

function searchMovie () {
    let queryMovie = query.value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    fetch(`https://www.omdbapi.com/?s=${queryMovie}&apikey=${YOUR_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                data.Search.forEach(movie => {
                    let movieCard = `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100" onClick="goToDetails('${movie.imdbID}')">
                                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                                <div class="card-body">
                                    <h5 class="card-title">${movie.Title}</h5>
                                    <p class="card-text">Año: ${movie.Year}</p>
                                </div>
                            </div>
                        </div>`;
                    resultsDiv.innerHTML += movieCard;
                });
            } else {
                resultsDiv.innerHTML = '<p class="text-danger">No se encontraron resultados.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

function setItemSearchTxt () {
    if (query.value) {
        localStorage.setItem(KEY_TXT_MOVIE, query.value);
    }
}

function goToDetails(id) {
    window.location.href = 'newPage.html?imdbID='+id;
}