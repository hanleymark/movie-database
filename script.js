const movieListPlaceholder = document.querySelector("#movie-list");
const movieDetailsPlaceholder = document.querySelector("#movie-details");
const modalWindow = document.querySelector("#modal-window");
const modalWindowTitle = document.querySelector("#modal-title");
const modalForm = document.querySelector("#modal-form");

let Movie = function (name, plot, cast, runtime, rating, year) {
    this.name = name;
    this.plot = plot;
    this.cast = cast;
    this.runtime = runtime;
    this.rating = rating;
    this.year = year;

    // Method returns string of 'length' characters of cast members (with ellipsis if truncated)
    this.getShortCast = function (length) {
        let castStr = "";
        for (let i = 0; i < this.cast.length; i++) {
            castStr += cast[i];
            // If this is not the last cast member, add a comma and a space
            if (i < (this.cast.length - 1)) {
                castStr += ", ";
            }
        }
        // If the cast string is longer than specified length, shorten it and add ellipsis (...)
        // Allow for the length of the ellipsis in the return string and zero based substring by subtracting four characters
        let shortCastStr = (castStr.length <= length) ? castStr : castStr.substring(0, length - 4) + "...";
        return shortCastStr;
    };
    this.getCast = function () {
        let castStr = "";
        for (let i = 0; i < this.cast.length; i++) {
            castStr += cast[i];
            // If this is not the last cast member, add a comma and a space
            if (i < (this.cast.length - 1)) {
                castStr += ", ";
            }
        }
        return castStr;
    };
}

importMovieData = function (catalogue, movies) {
    Object.keys(movies).forEach(name => {
        catalogue.push(new Movie(
            name,
            movies[name].plot,
            movies[name].cast,
            movies[name].runtime,
            movies[name].rating,
            movies[name].year)
        );
    });
}

getRow = function (index) {
    displayMovieTable(index);
}

displayMovieTable = function (selectedIndex) {
    let movieRowsHtml = "";
    for (let i = 0; i < movieCatalogue.length; i++) {
        let movie = movieCatalogue[i];
        if (selectedIndex === i) {
            movieRowsHtml += `<tr id="${i}" onclick="getRow(${i})" class="selected-row">`;
        }
        else {
            movieRowsHtml += `<tr id="${i}" onclick="getRow(${i})">`;
        }

        movieRowsHtml += `<td>${movie.name}</td>`;
        movieRowsHtml += `<td>${movie.year}</td>`;
        movieRowsHtml += `<td>${movie.getShortCast(30)}</td>`;
        movieRowsHtml += `<td>${movie.rating}</td>`;

        movieRowsHtml += `<td><button class="edit-button" onclick="editMovie(${i})">Edit</button></td>`
        movieRowsHtml += "</tr>";
    }
    movieListPlaceholder.innerHTML = movieRowsHtml;
    displayMovieDetails(selectedIndex);
}

displayMovieDetails = function (index) {
    if (typeof (index) === "number" && index >= 0 && index < movieCatalogue.length) {
        let movieDetailsHtml = "";

        let movie = movieCatalogue[index];

        movieDetailsHtml += `<h4>${movie.name} (${movie.year})</h4>`;
        movieDetailsHtml += `<p class="movie-plot">Plot: ${movie.plot}</p>`;
        movieDetailsHtml += `<p>Cast: ${movie.getCast()}</p>`;
        movieDetailsHtml += `<p>Runtime: ${movie.runtime} minutes</p>`;
        movieDetailsHtml += `<p>Rating: ${movie.rating}</p>`;

        movieDetailsPlaceholder.innerHTML = movieDetailsHtml;
    }
    else {
        movieDetailsPlaceholder.innerHTML = "<p>No movie has been selected. Select a movie in the list below to view its details.</p>";
    }
}

editMovie = function (index) {
    modalWindowTitle.textContent = "Edit movie";

    const movie = movieCatalogue[index];

    modalForm.elements["index"].value = index;
    modalForm.elements["name"].value = movie.name;
    modalForm.elements["year"].value = movie.year;
    modalForm.elements["cast"].value = movie.getCast();
    modalForm.elements["runtime"].value = movie.runtime;
    modalForm.elements["rating"].value = movie.rating;
    modalForm.elements["plot"].value = movie.plot;

    modalWindow.style.display = "block";

    modalForm.elements["name"].focus();
}

closeModal = function () {
    modalWindow.style.display = "none";
}

processForm = function (event) {
    console.log(`Movie ID = ${modalForm.elements["index"].value}`);

    let index = modalForm.elements["index"].value;
    let name = modalForm.elements["name"].value;
    let year = modalForm.elements["year"].value;
    let cast = modalForm.elements["cast"].value;
    let runtime = modalForm.elements["runtime"].value;
    let rating = modalForm.elements["rating"].value;
    let plot = modalForm.elements["plot"].value;

    if (checkFormNumbers()) {
        console.log("Numbers are all ok");
    }

    event.preventDefault();
}

checkFormNumbers = function() {
    let year = modalForm.elements["year"];
    let runtime = modalForm.elements["runtime"];
    let rating = modalForm.elements["rating"];

    if (year.value === "" || runtime.value === "" || rating.value === "") {
        return false;
    }

    if (!isNaN(+(year.value)) || !Number.isInteger(+(year.value))){
        year.setCustomValidity("Year should be a whole number");
        year.reportValidity();
        console.log("!!YEAR");
        return false;
    }
    if (!isNaN(runtime.value) || !Number.isInteger(runtime.value)) {
        runtime.setCustomValidity("Runtime should be a whole number");
        runtime.reportValidity();
        console.log("!!RUNTIME");
        return false;
    }
    if (!isNaN(rating.value)) {
        rating.setCustomValidity("Rating should be a number");
        year.reportValidity();
        console.log("!!RATING");
        return false;
    }
    year.setCustomValidity("");
    runtime.setCustomValidity("");
    rating.setCustomValidity("");
    return true;
}

let movieData = {
    "The Darjeeling Limited": {
        plot: "A year after their father's funeral, three brothers travel across India by train in an attempt to bond with each other.",
        cast: ["Jason Schwartzman", "Owen Wilson", "Adrien Brody"],
        runtime: 151,
        rating: 7.2,
        year: 2007,
    },
    "The Royal Tenenbaums": {
        plot: "The eccentric members of a dysfunctional family reluctantly gather under the same roof for various reasons",
        rating: 7.6,
        year: 2001,
        cast: ["Gene Hackman", "Gwnyeth Paltrow", "Anjelica Huston"],
        runtime: 170,
    },
    "Fantastic Mr. Fox": {
        year: 2009,
        plot: "An urbane fox cannot resist returning to his farm raiding ways and then must help his community survive the farmers' retaliation.",
        cast: [
            "George Clooney",
            "Meryl Streep",
            "Bill Murray",
            "Jason Schwartzman",
        ],
        runtime: 147,
        rating: 7.9,
    },
    "The Grand Budapest Hotel": {
        rating: 8.1,
        runtime: 159,
        year: 2014,
        plot: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
        cast: ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric"],
    },
    "The Grand Budapest Hotel 2": {
        rating: 6.1,
        runtime: 210,
        year: 2016,
        plot: "A writer returns to an aging high-class hotel to reprise his lobby boy activities.",
        cast: ["Ralph Fiennes"],
    },
};

let movieCatalogue = [];

importMovieData(movieCatalogue, movieData);
displayMovieTable("");
modalForm.addEventListener("submit", processForm);