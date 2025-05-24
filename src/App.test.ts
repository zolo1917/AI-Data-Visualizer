import request from "supertest";
import app from "./App"; // Assuming your Express app is exported from App.ts

describe("GET /hello", () => {
  it('should return 200 OK and "Hello World!"', async () => {
    const response = await request(app).get("/hello");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});
