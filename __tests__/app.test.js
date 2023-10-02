const app = require("../app");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("return 200 status code an array of topic objects, each of which should have the rpoperties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test.only("should get 404 bad request", () => {
    return request(app)
      .get("/api/not-topics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("wrong path");
      });
  });
});
