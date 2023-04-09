const express = require("express");
let app = express();
const cors = require("cors");
// const morgan = require("morgan");

app.use(cors());

morgan.token("id", (req) => {
  //creating id token
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] :response-time :id"));

// const tiny = morgan("tiny");
// app.use(tiny);

// morgan.token("header", (req) => {
//   return req.hostname;
// });

// app.use(morgan(":method :url :status :header"));

// app.use(
//   morgan(":method :status :param[id] :res[content-length] - :response-time ms")
// );

// morgan.token("param", function (req, res, param) {
//   return req.params[param];
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());

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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const pplNum = persons.length + 1;
  const date = Date();
  response.send(
    `<p>Phonebook has info for ${pplNum} people</p> <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  //get the id and ask
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Person with id ${id} is not found`;
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.statusMessage = `Person with ${id} has been deleted`;
  response.status(204).end;
});

app.post("/api/persons", (request, response) => {
  const idGenerator = () => {
    const currentList = persons.length > 0 ? persons.length : 0;
    return currentList + 1;
  };

  const newContactJSON = request.body;

  if (!newContactJSON.name || !newContactJSON.number) {
    response.status(400).json({ error: "Name and number must be filled" });
  } else if (persons.find((person) => person.name === newContactJSON.name)) {
    response.status(400).json({ error: "name must be unique" });
  } else {
    const newContact = {
      id: idGenerator(),
      name: newContactJSON.name,
      number: newContactJSON.number,
    };

    persons = persons.concat(newContact);
    response.json(newContact);
  }
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
