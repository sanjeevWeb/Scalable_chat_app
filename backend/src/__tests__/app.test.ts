import app from "../index.js";
import request from "supertest";

describe("GET /", () => {
    it('responds with "Welcome to unit testing!', async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe(
            "Welcome to unit testing!"
        );
    });
});