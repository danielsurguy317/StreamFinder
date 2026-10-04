let watchlist = [];
let latestResults = [];
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const randomBtn = document.getElementById("randomBtn");
const genreFilter = document.getElementById("genreFilter");
const resultsContainer = document.getElementById("results");
const watchlistItems = document.getElementById("watchlistItems");
const watchlistCount = document.getElementById("watchlistCount");


function displayResults(resultsToDisplay) {
    resultsContainer.innerHTML = "";

    resultsToDisplay.forEach(function (item, index) {
        const show = item.show;

        resultsContainer.innerHTML += `
            <article class="bg-slate-900 rounded-2xl overflow-hidden">
                <img
                    src="${show.image ? show.image.medium : 'https://placehold.co/300x420?text=No+Image'}"
                    class="w-full h-72 object-cover"
                    alt="${show.name}"
                >

                <div class="p-5">
                    <h2 class="text-xl font-bold">${show.name}</h2>

                    <p class="text-slate-400 mt-2">
                        ${show.genres.join(", ") || "Genre unavailable"}
                    </p>

                    <p class="text-yellow-400 mt-3">
                        Rating: ${show.rating.average ?? "N/A"}
                    </p>

                    <button
                        class="add-watchlist bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg mt-4 font-semibold"
                        data-index="${index}"
                    >
                        + Watchlist
                    </button>
                </div>
            </article>
        `;
    });
}



genreFilter.addEventListener("change", function () {
    const selectedGenre = genreFilter.value;

    const filteredResults = latestResults.filter(function (item) {
        const show = item.show;

        if (selectedGenre === "All") {
            return true;
        }

        return show.genres.includes(selectedGenre);
    });

    displayResults(filteredResults);
});



function renderWatchlist() {
    watchlistCount.textContent = watchlist.length;

    if (watchlist.length === 0) {
        watchlistItems.innerHTML =
            '<p class="text-slate-400">Your watchlist is empty.</p>';
        return;
    }

    watchlistItems.innerHTML = "";

    watchlist.forEach(function (show) {
        watchlistItems.innerHTML += `
            <article class="bg-slate-900 rounded-xl p-4">
                <h3 class="text-xl font-bold">${show.name}</h3>

                <p class="text-slate-400 mt-2">
                    ${show.genres.join(", ") || "Genre unavailable"}
                </p>

                <button
                    class="remove-watchlist bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg mt-4"
                    data-id="${show.id}"
                >
                    Remove
                </button>
            </article>
        `;
    });
}

function searchshows() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        message.textContent = "Please enter a show name.";
        return;
    }

    message.textContent = "Searching for " + searchTerm;

    fetch("https://api.tvmaze.com/search/shows?q=" + encodeURIComponent(searchTerm))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            if (data.length === 0) {
                message.textContent = "No shows found. Try another name.";
                return;
            }

            latestResults = data;
            displayResults(latestResults);

            message.textContent = "You searched for: " + searchTerm;
        })
        .catch(function (error) {
            console.error(error);
            message.textContent = "Something went wrong. Please try again.";
        });
}

searchBtn.addEventListener("click", function () {
    searchshows();
});

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// const randomBtn = document.getElementById("randomBtn");
randomBtn.addEventListener("click", function () {
if (latestResults.length === 0) {
message.textContent = "Search for some shows first.";
return;
}
const randomNumber = Math.floor(Math.random() * latestResults.length);
const randomShow = latestResults[randomNumber].show;
message.textContent = "Tonight's pick: " + randomShow.name;
});

resultsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".add-watchlist");

    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);
    const show = latestResults[index].show;

    const alreadySaved = watchlist.some(function (item) {
        return item.id === show.id;
    });

    if (alreadySaved) {
        message.textContent = show.name + " is already in your watchlist.";
        return;
    }

    watchlist.push(show);

    renderWatchlist();

    message.textContent = show.name + " added to your watchlist!";
});


watchlistItems.addEventListener("click", function (event) {
    const button = event.target.closest(".remove-watchlist");

    if (!button) {
        return;
    }

    const showId = Number(button.dataset.id);

    watchlist = watchlist.filter(function (show) {
        return show.id !== showId;
    });

    renderWatchlist();
});

searchInput.addEventListener("input", function() {
    if (searchInput.value.trim() !== "") {
        searchshows();
    }
});