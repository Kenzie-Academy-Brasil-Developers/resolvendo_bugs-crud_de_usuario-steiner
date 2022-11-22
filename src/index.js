import express from "express";
import { v4 as uuidV4 } from "uuid";
import { users } from "./database";

const app = express();
app.use(express.json());
const PORT = 3000;

// Services
const createUserService = (dataUser) => {
  const { email, name, birthDate } = dataUser;
  const userArealdyExists = users.find((user) => user.email === email);

  if (userArealdyExists) {
    const error = { message: "This email address is already being user" };
    return [409, error];
  }

  const newUser = {
    uuid: uuidV4(),
    email,
    name,
    birthDate,
  };

  users.push(newUser);

  return [201, newUser];
};

const listUsersService = () => {
  return [201, users];
};

const deleteUserService = (uuid) => {
  const userIndex = users.findIndex((user) => user.uuid === uuid);

  if (userIndex < 0) {
    const error = { message: "User not found" };
    return [404, error];
  }

  users.splice(userIndex, 1);

  return [200];
};

const updateUserService = (uuid, body) => {
  const user = users.find((user) => user.uuid === uuid);

  if (!user) {
    const error = { message: "User not found" };
    return [404, error];
  }

  const updateUser = {
    ...user,
    ...body,
  };

  const userIndex = users.indexOf((user) => user.uuid === uuid);
  users.splice(userIndex, 1, updateUser);

  return [200, updateUser];
};

// Controllers
const createUserController = (request, response) => {
  const dataUser = request.body;

  const [status, data] = createUserService(dataUser);
  return response.status(status).json(data);
};

const listUsersController = (request, response) => {
  const [status, listUsers] = listUsersService();

  return response.json(listUsers);
};

const deleteUserController = (request, response) => {
  const { uuid } = request.params;

  const [status, data] = deleteUserService(uuid);

  return response.status(status).json(data);
};

const updateUserController = (request, response) => {
  const { uuid } = request.params;
  const { body } = request;

  const [status, data] = updateUserService(uuid, body);

  return response.status(status).json(data);
};

app.post("/register", createUserController);
app.get("/users", listUsersController);
app.delete(`/user/:uuid`, deleteUserController);
app.patch(`/user/:uuid`, updateUserController);

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
