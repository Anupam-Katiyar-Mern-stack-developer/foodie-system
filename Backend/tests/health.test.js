import { describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

describe("Foodie API Health Check", () => {
  test("GET /health should return 200 and success response", async () => {
    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.message, "Foodie API is running");
  });
});
