const app = require("../app");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const endpointsData = require("../endpoints.json");

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
  test("should get 404 bad request", () => {
    return request(app)
      .get("/api/not-topics")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("wrong path");
      });
  });
});

describe("GET /api", () => {
  test("should responed with status 200 and correct endpoint information", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.apiInfo).toEqual(endpointsData);
      });
  });
});

describe("GET /api/articles", () => {
  test("should respond with 200 and array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((results) => {
        expect(results.body.articles.length).toBe(13);
        results.body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("author");
        });
        expect(results.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should respond with 200 and valid article and the responce object has correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article).toHaveProperty(
          "author",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "article_id",
          expect.any(Number)
        );
        expect(response.body.article).toHaveProperty("body");
        expect(response.body.article).toHaveProperty("created_at");
        expect(response.body.article).toHaveProperty(
          "votes",
          expect.any(Number)
        );
        expect(response.body.article).toHaveProperty("article_img_url");
      });
  });
  describe("Shoud handle errors", () => {
    test("shpuld return 404 and not found", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
  test("shpuld return 400 and Invalid input", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should add a comment for an article", () => {
    const newComment = {
      username: "rogersop",
      body: "example of comprehensive and non biased comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe(newComment.body);
        expect(body.comment).toHaveProperty("article_id", expect.any(Number));
        expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
        expect(body.comment).toHaveProperty("author", expect.any(String));
        expect(body.comment).toHaveProperty("votes", expect.any(Number));
        expect(body.comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("Successfully ignores extra properties on the input body", () => {
    const newComment = {
      username: "rogersop",
      body: "example of comprehensive and non biased comment",
      comment_id: "191919",
      votes: 100000,
      country_of_origin: "Brazil",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe(newComment.body);
        expect(body.comment.comment_id).not.toBe(newComment.comment_id);
        expect(body.comment).not.toHaveProperty("country_of_origin");
        expect(body.comment.votes).not.toBe(newComment.votes);
      });
  });
  describe("shoud handle errors when provided with wrong input", () => {
    test("should respond with 400 bad request when username is not provided", () => {
      const newComment = {
        body: "example of comprehensive and non biased comment",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("should respond with 400 bad request when body is not provided", () => {
      const newComment = {
        username: "rogersop",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("should respond with 404 not found when id is not found", () => {
      const newComment = {
        username: "rogersop",
        body: "example of comprehensive and non biased comment",
      };
      return request(app)
        .post("/api/articles/200/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    test("should respond with 404 not found when provided with non existing ID", () => {
      const newComment = {
        username: "rogersop",
        body: "example of comprehensive and non biased comment",
      };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    test("should respond with 404 not found when user is non exiting", () => {
      const newComment = {
        username: "not-a-user",
        body: "example of comprehensive and non biased comment",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Should return 200 and and vote count shoud be incrumented by 1", () => {
    const body = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(101);
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("topic");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("article_img_url");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("votes");
      });
  });
  test("Should return 200 and and vote count shoud be incrumented by 1", () => {
    const body = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(50);
      });
  });
  test("Should ignore irrelevant inputs", () => {
    const body = {
      inc_votes: -50,
      title: "changed title",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(50);
        expect(body.title).not.toBe("changed title");
      });
  });
  test("Should ignore irrelevant inputs", () => {
    const body = {
      inc_votes: "not votes",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  describe("should handle errors", () => {
    test("should return 400 bad request", () => {
      const body = { not_votes: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});
