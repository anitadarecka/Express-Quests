const database = require("./database");

const getUsers = (req, res) => {
  const { language } = req.query;
  const { city } = req.query;
  let sql = "SELECT * FROM users";
  const sqlValues = [];

  if (language) {
    sql += " WHERE language = ?";
    sqlValues.push(language);
      if (city) {
        sql += " AND city = ?";
        sqlValues.push(city);
      }
  } else if (city) {
    sql += " WHERE city = ?";
    sqlValues.push(city);
  };

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });

};

const addUser = (req, res) => {
  const userData = req.body;
  database
    .query("INSERT INTO users SET ?", 
    [userData])
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving the user");
    })
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
    .then(([user]) => {
      if (user[0]) {
        res.status(200).json(user[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data from database")
    })
};

const updateUsers = (req, res) => {
    const userData = req.body;
    const id = parseInt(req.params.id);

    database
    .query("UPDATE users SET ? WHERE id = ?",
    [userData, id]
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
      res.status(500).send("Error editing the user");
    })
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
  .query("DELETE FROM users WHERE id = ?", [id])
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error delete the user");
  })
};

module.exports = {
  getUsers,
  getUserById,  
  addUser,
  updateUsers,
  deleteUser,
}