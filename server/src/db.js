import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolvePath } from "./util.js";

sqlite3.verbose();

// Open and initialize the database
const db = await open({
  filename: resolvePath("db.sqlite"),
  driver: sqlite3.Database,
});

// await db.run("DROP TABLE IF EXISTS lorem");
// await db.run("CREATE TABLE lorem (username TEXT, password TEXT)");

// await db.run("INSERT INTO lorem (username, password) VALUES (?, ?)", ["samin", "123"]);
// await db.run("INSERT INTO lorem (username, password) VALUES (?, ?)", ["elling", "1234"]);

// const statement = await db.prepare("INSERT INTO lorem VALUES (?)");
// for (let i = 0; i < 10; i += 1) {
// statement.run(`ipsum ${i}`);
// }
// statement.finalize();

async function checkAssistant(username, password) {
  console.log(`${username}+${password}`);
  const row1 = await db.get(
    "SELECT * FROM lorem WHERE username = ? AND password = ?",
    [username, password]
  );

  if (row1) {
    return true;
  }

  return false;
}
async function registerUser(username, password) {
  console.log(`register${username} +${password}`);

  const insertQuery = "INSERT INTO lorem (username, password) VALUES (?, ?)";
  const insertData = [username, password];
  const row1 = await db.get("SELECT * FROM lorem WHERE username = ?", [
    username,
  ]);

  if (row1) {
    console.log("user already exists");
    return true;
  }

  try {
    await db.run(insertQuery, insertData);
    return true;
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return false;
  }
}

export { checkAssistant, registerUser };

export default db;
