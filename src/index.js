import express from "express";

const app = express();

// Services
const createUserService = (email, name, birthDate) => {
  const userArealdyExists = users.find((user) => user.email === email);

  if (userArealdyExists) {
    return "This email address is already being used";
  }

  const newUser = {
    email,
    name,
    birthDate,
  };

  users.push(newUser);
};

const listUsersService = () => {
  return users;
};

// Controllers
const createUserController = (request, response) => {
  const { email, name, birthDate } = request.body;

  const user = createUserService(email, name);

  return response.send(user);
};

const listUsersController = (request, response) => {
  const usersList = listUsersService();

  return response.json(users);
};

const deleteUserController = (request, response) => {
  const { id } = request.body;

  const userIndex = users.findIndex((element) => element.id === id);

  if (userIndex === -1) {
    return response.status(404).json("User not found");
  }

  users.splice(userIndex, 1);

  return response.json("Usuário excluido");
};

export default deleteUserController;

express.post("", createUserController);
express.get("", listUsersController);
express.delete("/id", deleteUserController);

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
