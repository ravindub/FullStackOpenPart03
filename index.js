const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  const id = Math.random();
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  const name = persons.find((person) => person.name === body.name);

  if (name) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  //console.log(persons);
  res.json(person);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  const now = new Date();

  response.send(
    `<p>Phonebook has info of ${
      persons.length
    } people </P> <p>${now.toUTCString()}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
