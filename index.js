require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("data", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

const format =
  ":method :url :status :res[content-length] - :response-time ms :data";

app.use(morgan(format));

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  Person.find({ name: body.name }).then((result) => {
    if (result.length !== 0) {
      return res.status(400).json({
        error: "Name must be unique",
      });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      person.save().then((savedNote) => {
        res.json(savedNote);
      });
    }
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const now = new Date();

  Person.find({}).then((people) => {
    response.send(
      `<p>Phonebook has info of ${
        people.length
      } people </P> <p>${now.toUTCString()}</p>`
    );
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const unknowsEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknowsEndPoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed ID" });
  }
  next(error);
};

app.use(errorHandler);
