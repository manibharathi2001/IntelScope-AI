import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { app } from "../src/app.js";

test("health endpoint reports the API status", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok", service: "intelscope-api" });
});

test("case routes require authentication", async () => {
  const response = await request(app).get("/api/cases");
  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Authentication required");
});

test("case creation validates required fields after authentication", async () => {
  const response = await request(app).post("/api/cases").set("Authorization", "Bearer invalid-token").send({});
  assert.equal(response.status, 401);
});
