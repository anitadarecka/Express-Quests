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
};
