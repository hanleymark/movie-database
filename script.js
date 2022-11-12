const movieListPlaceholder = document.querySelector("#movie-list");
const movieDetailsPlaceholder = document.querySelector("#movie-details");
const modalWindow = document.querySelector("#modal-window");
const modalWindowTitle = document.querySelector("#modal-title");
const modalForm = document.querySelector("#modal-form");
const NEW_MOVIE = -1;

// Movie object represents one movie
let Movie = function (name, plot, cast, runtime, rating, year) {
    this.name = name;
    this.plot = plot;
    this.cast = cast;
    this.runtime = runtime;
    this.rating = rating;
    this.year = year;

    // Method returns string of 'length' characters of cast members (with ellipsis if truncated)
    this.getShortCast = function (length) {
        let castStr = this.getCastAsString();
        // If the cast string is longer than specified length, shorten it and add ellipsis (...)
        // Allow for the length of the ellipsis in the return string and zero based substring by subtracting four characters
        let shortCastStr = (castStr.length <= length) ? castStr : castStr.substring(0, length - 4) + "...";
        return shortCastStr;
    };
    // Method returns array of cast actors separated by comma+space in a string
    this.getCastAsString = function () {
        let castStr = this.cast.toString();
        let castStrWithSpaces = "";

        // Iterate through the cast array as a string and add a space after each comma in a new string
        for (let i = 0; i < castStr.length; i++) {
            if (castStr[i] == ",") {
                castStrWithSpaces += ", ";
            }
            else {
                castStrWithSpaces += castStr[i];
            }
        }
        return castStrWithSpaces;
    };

    // Method imports a string of actors separated by commas and converts to an array of actor name strings
    // Then sets the 'cast' property to this array
    this.importCastFromCommaSeparatedString = function (castList) {
        // Split string of comma separated actor names into an array of string
        let castArray = castList.split(",");

        this.cast = [];
        // Iterate through actor strings and remove any spaces at the beginning or end of each
        // Push each one to this.cast
        for (let i = 0; i < castArray.length; i++) {
            this.cast.push(castArray[i].trim());
        }
    };
}

// Function imports data from the supplied 'movies' object array and adds a new Movie object
// for each one to the supplied catalogue array
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

// Function highlights a row in the movie table then displays movie details
// Called by onclick event handler in movie table row
selectMovieTableRow = function (index) {
    displayMovieTable(index);
}

// Display abbreviated information about all movies in table
displayMovieTable = function (selectedIndex) {
    let movieRowsHtml = "";
    // Iterate through all Movie objects in the movieCatalogue
    for (let i = 0; i < movieCatalogue.length; i++) {
        let movie = movieCatalogue[i];
        // If this row is the one that was clicked on then change its style to 'selected-row'
        if (selectedIndex === i) {
            movieRowsHtml += `<tr id="${i}" onclick="selectMovieTableRow(${i})" class="selected-row">`;
        }
        else {
            movieRowsHtml += `<tr id="${i}" onclick="selectMovieTableRow(${i})">`;
        }

        movieRowsHtml += `<td>${movie.name}</td>`;
        movieRowsHtml += `<td>${movie.year}</td>`;
        movieRowsHtml += `<td>${movie.getShortCast(24)}</td>`;
        movieRowsHtml += `<td>${movie.rating}</td>`;
        // Add an edit button at the end of the table row
        movieRowsHtml += `<td align="right"><button class="edit-button" onclick="editMovie(${i})">Edit</button></td>`
        movieRowsHtml += "</tr>";
    }
    // Add an 'add new' button at the end of the table
    movieRowsHtml += `<tr><td></td><td></td><td></td><td></td><td align="right"><button class="new-button" onclick="newMovie()">Add new</button></td>`;
    movieListPlaceholder.innerHTML = movieRowsHtml;
    displayMovieDetails(selectedIndex);
}

// Function displays the details of the selected movie at the bottom of the page
displayMovieDetails = function (index) {
    if (typeof (index) === "number" && index >= 0 && index < movieCatalogue.length) {
        let movieDetailsHtml = "";

        let movie = movieCatalogue[index];

        movieDetailsHtml += `<h4>${movie.name} (${movie.year})</h4>`;
        movieDetailsHtml += `<p class="movie-plot">Plot: ${movie.plot}</p>`;
        movieDetailsHtml += `<p>Cast: ${movie.getCastAsString()}</p>`;
        movieDetailsHtml += `<p>Runtime: ${movie.runtime} minutes</p>`;
        movieDetailsHtml += `<p>Rating: ${movie.rating}</p>`;

        movieDetailsPlaceholder.innerHTML = movieDetailsHtml;
    }
    else {
        movieDetailsPlaceholder.innerHTML = "<p>No movie has been selected. Select a movie in the list above to view its details.</p>";
    }
}

// Display 'Edit movie' modal window and populate with the details of the selected movie
editMovie = function (index) {
    modalWindowTitle.textContent = "Edit movie";
    modalForm.reset();
    const movie = movieCatalogue[index];

    modalForm.elements["index"].value = index;
    modalForm.elements["name"].value = movie.name;
    modalForm.elements["year"].value = movie.year;
    modalForm.elements["cast"].value = movie.getCastAsString();
    modalForm.elements["runtime"].value = movie.runtime;
    modalForm.elements["rating"].value = movie.rating;
    modalForm.elements["plot"].value = movie.plot;

    modalWindow.style.display = "block";

    modalForm.elements["name"].focus();
}

// Display a 'New movie' modal window
newMovie = function () {
    modalWindowTitle.textContent = "New movie";
    modalForm.reset();
    modalForm.elements["index"].value = NEW_MOVIE;

    modalWindow.style.display = "block";

    modalForm.elements["name"].focus();
}

// Close the modal window
closeModal = function () {
    modalWindow.style.display = "none";
}

// Function validates form data for editing and creating new movie form
processForm = function (event) {
    let index = modalForm.elements["index"].value;
    let name = modalForm.elements["name"].value;
    let year = modalForm.elements["year"].value;
    let cast = modalForm.elements["cast"].value;
    let runtime = modalForm.elements["runtime"].value;
    let rating = modalForm.elements["rating"].value;
    let plot = modalForm.elements["plot"].value;

    // Update existing movie object if editing
    if (index != NEW_MOVIE) {
        if (checkFormNumbers()) {
            let movie = movieCatalogue[index];

            movie.name = name;
            movie.year = year;
            movie.runtime = runtime;
            movie.rating = rating;
            movie.plot = plot;
            movie.importCastFromCommaSeparatedString(cast);
        }
    }
    // Create a new movie and import the cast to it if adding a new movie
    else {
        if (checkFormNumbers()) {
            let movie = new Movie(name, plot, [], runtime, rating, year);
            movie.importCastFromCommaSeparatedString(cast);
            movieCatalogue.push(movie);
        }
    }
    closeModal();
    displayMovieTable();

    event.preventDefault();
}

// Form validation function checks numbers are correctly formatted. Report any errors to user.
checkFormNumbers = function () {
    let year = modalForm.elements["year"];
    let runtime = modalForm.elements["runtime"];
    let rating = modalForm.elements["rating"];

    if (year.value === "" || runtime.value === "" || rating.value === "") {
        return false;
    }

    if (isNaN(+(year.value)) || !Number.isInteger(+(year.value))) {
        year.setCustomValidity("Year should be a whole number");
        year.reportValidity();
        return false;
    }
    if (isNaN(+(runtime.value)) || !Number.isInteger(+(runtime.value))) {
        runtime.setCustomValidity("Runtime should be a whole number");
        runtime.reportValidity();
        return false;
    }
    if (isNaN(+(rating.value))) {
        rating.setCustomValidity("Rating should be a number");
        year.reportValidity();
        return false;
    }
    year.setCustomValidity("");
    runtime.setCustomValidity("");
    rating.setCustomValidity("");

    year.reportValidity();
    runtime.reportValidity("");
    rating.reportValidity("");
    return true;
}

// Supplied movie data object array
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

// Initialise the movie catalogue
let movieCatalogue = [];

importMovieData(movieCatalogue, movieData);
displayMovieTable("");
modalForm.addEventListener("submit", processForm);