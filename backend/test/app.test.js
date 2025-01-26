const request = require("supertest");
const app = require("../app");
const db = require("../config/database");

beforeAll(async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
        )`);

    await db.query(`
        CREATE TABLE IF NOT EXISTS tasks(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            dueDate DATE,
            status VARCHAR(50)
        )`);
});

afterAll(async () => {
    await db.query("DROP TABLE IF EXISTS users");
    await db.query("DROP TABLE IF EXISTS tasks");
    await db.end();
});

describe("Task Management API", () => {
    test("Register a new user", async () => {
        const response = await request(app)
            .post("/graphql")
            .send({
                query: `
                    mutation {
                        register(user: { username: "testuser", password: "password123" }) {
                            id
                            username
                        }
                    }
                `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.register.username).toBe("testuser");
    });

    test("Login with registered user", async () => {
        const response = await request(app)
            .post("/graphql")
            .send({
                query: `
                    mutation {
                        login(user: { username: "testuser", password: "password123" }) {
                            id
                            username
                            token
                        }
                    }
                `,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.login.token).toBeDefined();
    });

    test("Create a new task", async () => {
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: `
            mutation {
              login(user: { username: "testuser", password: "password123" }) {
                token
              }
            }
          `,
            });

        const token = loginResponse.body.data.login.token;

        const taskResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${token}`)
            .send({
                query: `
            mutation {
              createTask(task: { title: "Test Task", description: "A task for testing", dueDate: "2025-01-31", status: "pending" }) {
                id
                title
                status
              }
            }
          `,
            });

        expect(taskResponse.status).toBe(200);
        expect(taskResponse.body.data.createTask.title).toBe("Test Task");
    });


});
