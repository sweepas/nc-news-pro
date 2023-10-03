const db = require("../db/connection");
const fs = require("fs/promises");
const path = require("path");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((results) => {
    return results.rows;
  });
};

exports.fetchApiInfo = () => {
  const endpointsDataPath = path.resolve(__dirname, "../endpoints.json");
  return fs.readFile(endpointsDataPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
