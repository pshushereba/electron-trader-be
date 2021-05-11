const db = require("../data/db-config.js");

function findById(id) {
  return db("users").where({ id }).first();
}

function findByUsername(username) {
  return db("users").where({ username }).first();
}

function searchByUsername(username) {
  return db("users").where("username", "like", `%${username}%`);
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await db("users").returning("id").insert(user);

  return findById(id);
}

async function updateUser(id, changes) {
  await db("users").where({ id }).update(changes);

  const changedUser = await findById(id);
  return changedUser;
}

async function deleteUser(id) {
  const deleted = await db("users").where({ id }).del();

  return deleted;
}

async function getAllUsers() {
  return await db("users").select();
}

module.exports = {
  findById,
  findBy,
  findByUsername,
  searchByUsername,
  add,
  updateUser,
  deleteUser,
  getAllUsers,
};