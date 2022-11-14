const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
  .query("INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
  [title, director, year, color, duration]
  )
  .then(([result]) => {
    res.location(`/api/movies/${result.insertId}`).sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  })
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from movies where id = ?", [id])
    .then(([movie]) => {
      if (movie[0]) {
      res.json(movie[0]);
      } else {
        res.sendStatus(418);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(418);
    })
};

module.exports = {
  getMovies,
  getMovieById,
  postMovies,
};
