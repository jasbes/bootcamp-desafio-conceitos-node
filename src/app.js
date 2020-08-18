const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs} = request.body;

  const newRepo =  {id: uuid(), title, url, techs, likes: 0};

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {

  const index = getIndex(request);

  if(index < 0) {
    return response.status(400).json({error: 'Repository does not exist.'});
  }

  const { title, url, techs} = request.body;

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {

  const index = getIndex(request);

  if(index < 0) {
    return response.status(400).json({error: 'Repository does not exist.'});
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const index = getIndex(request);

  if(index < 0) {
    return response.status(400).json({error: 'Repository does not exist.'});
  }

  const repo = repositories[index];
  repo.likes +=1;

  return response.json(repo);
});

const getIndex = (request) => {
  const { id } = request.params;

  return repositories.findIndex(repo => repo.id === id);
}

module.exports = app;
