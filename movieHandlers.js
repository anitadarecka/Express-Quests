const database = require("./database");

const getMovies = (req, res) => {
  const { color } = req.query;
  const { max_duration } = req.query;
  let sql = "SELECT * FROM movies";
  const sqlValues = [];

  if (color) {
    sql += " WHERE color = ?";
    sqlValues.push(color);
    if (max_duration) {
      sql += " AND duration <= ?";
      sqlValues.push(max_duration);
  } else if (max_duration) {
    sql += " WHERE duration <= ?";
    sqlValues.push(max_duration);
  };
}

  database
    .query(sql, sqlValues)
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

const putMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  const id = parseInt(req.params.id);

  database
  .query("UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
  [title, director, year, color, duration, id]
  )
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error editing the movie");
  })
}

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

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
  .query("DELETE FROM movies WHERE id = ?", [id])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);

    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error deleting the movie");
  })
};

module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  putMovies,
  deleteMovie,
};
