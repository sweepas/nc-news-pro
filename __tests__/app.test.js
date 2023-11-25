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
        expect(response.body.article).toHaveProperty("comment_count");
        expect(response.body.article).toHaveProperty(
          "votes",
          expect.any(Number)
        );
        expect(response.body.article).toHaveProperty("article_img_url");
      });
  });
  describe("Error handaling", () => {
    test("shpuld return 404 and not found", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
    test("shpuld return 404 and not found when provided with valid id", () => {
      return request(app)
        .get("/api/articles/200")
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

describe("GET /api/articles/:article_id/comments", () => {
  test("should return 200 and an array of comments in descending orded by created_at", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        expect(response.body.comments).toBeInstanceOf(Array);
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("Should handle errors", () => {
  test("should return 404 Not Found if provided with non existing id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("should return 404 Not Found if provided with valid but existing id", () => {
    return request(app)
      .get("/api/articles/200/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("should return 400 Bad request if provided with non valid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
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
    test("should respond with 404 not found when id is not existing", () => {
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
        expect(body.article_id).toBe(1);
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
  test("Should return 200 and and original article with votes unchanged if not inc-votes provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send()
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(100);
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
});
describe("should handle errors", () => {
  test("should return 404 : not found when provided with valid but non existing id", () => {
    return request(app)
      .patch("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
test("should return 400 : invalid input, when not valid ID ", () => {
  return request(app)
    .patch("/api/articles/not-id")
    .expect(400)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid input");
    });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should return 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should return 404 not found if provided with not existing ID", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("should return 404 not found if provided with not existing ID", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
describe("/api/users", () => {
  test("should respond with 200 and array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("should get 404 bad request", () => {
    return request(app)
      .get("/api/not-users")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("wrong path");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("should respond with 200 and article array with relevant topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("author");
        });
      });
  });
  describe("Error handling", () => {
    test("should return 404: Not Found if provided with valid, but non existing id", () => {
      return request(app)
        .get("/api/articles?topic=football")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("should return 404: Not Found if provided with valid, but non existing id", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    test("should return 404: Not Found if provided with valid, but non existing id", () => {
      return request(app)
        .get("/api/articles?topic=99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("should sortby author and preferred order", () => {
    return request(app)
      .get("/api/articles?sortby=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("should sortby author and preferred order", () => {
    return request(app)
      .get("/api/articles?sortby=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: false });
      });
  });
  test("should sort by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sortby=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: false });
      });
  });
  test("should sort by topic in ascending order", () => {
    return request(app)
      .get("/api/articles?sortby=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", {
          descending: false,
        });
      });
  });
  test("should sort by articles in ascending order", () => {
    return request(app)
      .get("/api/articles?sortby=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("should sort comment count in descending", () => {
    return request(app)
      .get("/api/articles?sortby=comment_count&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
      });
  });
  describe("should handle errors", () => {
    test("if provided non existing column should default to created_as", () => {
      return request(app)
        .get("/api/articles?sortby=not-valid-column")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  test("if provided with existing column but not valid sortby should default to ", () => {
    return request(app)
      .get("/api/articles?sortby=article_img_url")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("should return 200 and an object with relevant properties", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("avatar_url");
        expect(body).toHaveProperty("name");
      });
  });
  describe("Should handle errors", () => {
    test("Should return 404 Not found if provided with non existing user", () => {
      return request(app)
        .get("/api/users/non-existing-username")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should return 200 update the votes on a comment given the comment's comment_id", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(17);
        expect(body.comment).toHaveProperty("author");
        expect(body.comment).toHaveProperty("body");
        expect(body.comment).toHaveProperty("article_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment).toHaveProperty("comment_id");
      });
  });
  test("Should return 200 and original article with votes unchanged if not inc-votes provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send()
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(16);
      });
  });
  test("Should return 200 and ignore irrelevant inputs", () => {
    const newVote = {
      inc_votes: -1,
      body: "not valid",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(15);
        expect(body.comment.body).not.toEqual(newVote.body);
      });
  });
  describe("Should handle errors", () => {
    test("Should return 404 Not found if provided with valid but non existing id", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("Should return 404 Not found if provided with valid but non existing id", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/not-a-comment-id")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
describe("POST /api/articles", () => {
  test("returns 201 with relevant properties", () => {
    const body = {
      author: "lurker",
      title: "title",
      body: "lorem ipsum",
      topic: "mitch",
      article_img_url: "sd",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(0);
        expect(body.article_id).toBe(14);
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("comment_count");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("created_at");
      });
  });
  test("returns 404 if user is not in the database", () => {
    const body = {
      author: "not-a-user",
      title: "title",
      body: "lorem ipsum",
      topic: "mitch",
      article_img_url: "sd",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("returns 404 if topic is not existing", () => {
    const body = {
      author: "lurker",
      title: "title",
      body: "lorem ipsum",
      topic: "footbal",
      article_img_url: "sd",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("returns 401 if body is empty", () => {
    const body = {
      author: "lurker",
      title: "title",
      body: "",
      topic: "footbal",
      article_img_url:
        "https://jobs.ficsi.in/assets/front_end/images/no-image-found.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("returns 201 if article_img_url is not provided (inserts default)", () => {
    const body = {
      author: "lurker",
      title: "title",
      body: "lorem ipsum",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(0);
        expect(body.article_id).toBe(14);
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("comment_count");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("created_at");
      });
  });
});
describe("GET /api/articles (topic query)", () => {
  test("should respond with 200 and article array with relevant topic", () => {
    return request(app)
      .get("/api/articles?page=1&limit=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
        expect(body).toHaveProperty("total_count");
        body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("author");
        });
      });
  });
  test("should rdefault limit to 10 if not provided", () => {
    return request(app)
      .get("/api/articles?page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("should rdefault limit to 10 if not provided", () => {
    return request(app)
      .get("/api/articles?page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("should default limit to 10 if not provided and work with other filters", () => {
    return request(app)
      .get("/api/articles?topic=mitch&page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        expect(body.articles[5].topic).toBe("mitch");
      });
  });
  test("should work with other filters", () => {
    return request(app)
      .get("/api/articles?topic=cats&page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        expect(body.total_count).toBe(1);
        expect(body.articles[0].topic).toBe("cats");
      });
  });
  test("should return 400 if provided with negative or non numerical values", () => {
    return request(app)
      .get("/api/articles?page=1&limit=c")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 404 if page requested exceeds total count of articles", () => {
    return request(app)
      .get("/api/articles?page=10")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should paginate results", () => {
    return request(app)
      .get("/api/articles/1/comments?page=1&limit=3")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(3);
        expect(response.body.comments).toBeInstanceOf(Array);
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return 400 if provided with negative or non numerical values", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(3);
        expect(response.body.comments).toBeInstanceOf(Array);
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("POST /api/topics", () => {
  test("responds with a topic object containing the newly added topic", () => {
    const newTopic = {
      slug: "topic name here",
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toBe("topic name here");
      });
  });
  test("should return 400 if provided just one value", () => {
    const newTopic = {
      slug: "topic name here",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 400 if provided with numbers", () => {
    const newTopic = {
      slug: 15,
      description: 99,
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("DELETE /api/articles/:article_id", () => {
  test("should delete article with it respective comments and respond with nothing", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test("should return 404 if trying to delete non existing item", () => {
    return request(app)
      .delete("/api/articles/88")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
