let Movie = function (name, plot, cast, runtime, rating, year) {
    this.name = name;
    this.plot = plot;
    this.cast = cast;
    this.runtime = runtime;
    this.rating = rating;
    this.year = year;
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
};

let movieDataPlaceholder = document.querySelector("#movie-data");

let movieCatalogue = [];

importMovieData (movieCatalogue, movieData);

let movieRowsHtml = "";
for (let i = 0; i < movieCatalogue.length; i++) {
    let movie = movieCatalogue[i];
    movieRowsHtml += "<tr>";
    movieRowsHtml += `<td>${movie.name}</td>`;
    movieRowsHtml += `<td>${movie.year}</td>`;
    movieRowsHtml += `<td>${movie.cast}</td>`;
    movieRowsHtml += `<td>${movie.rating}</td>`;
    movieRowsHtml += "</tr>";
}
//console.log(movieRowsHtml);
movieDataPlaceholder.innerHTML = movieRowsHtml;