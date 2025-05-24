import request from "supertest";
import app from "./App"; // Assuming your Express app is exported from App.ts
import fs from "fs";
import path from "path";

// Define the upload directory path
const uploadDir = path.join(__dirname, "UploadedFiles");

describe("GET /hello", () => {
  it('should return 200 OK and "Hello World!"', async () => {
    const response = await request(app).get("/hello");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("POST /upload", () => {
  // Create a dummy file for testing
  const testFilePath = path.join(__dirname, "test-file.txt");
  const testFileContent = "This is a test file.";

  beforeEach(() => {
    // Create the dummy file before each test
    fs.writeFileSync(testFilePath, testFileContent);
    // Ensure UploadedFiles directory exists or create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up the dummy file and UploadedFiles directory
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
  });

  it("should upload a single file successfully", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", testFilePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File uploaded successfully");

    // Check if the file was actually uploaded
    const uploadedFilePath = path.join(uploadDir, "test-file.txt");
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
    expect(fs.readFileSync(uploadedFilePath, "utf-8")).toBe(testFileContent);
  });

  it("should upload multiple files successfully", async () => {
    const testFile2Path = path.join(__dirname, "test-file2.txt");
    fs.writeFileSync(testFile2Path, "This is another test file.");

    const response = await request(app)
      .post("/upload")
      .attach("file", testFilePath)
      .attach("file", testFile2Path);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File uploaded successfully");

    expect(fs.existsSync(path.join(uploadDir, "test-file.txt"))).toBe(true);
    expect(fs.existsSync(path.join(uploadDir, "test-file2.txt"))).toBe(true);

    fs.unlinkSync(testFile2Path); // Clean up second test file
  });

  it("should return 400 if no file is uploaded", async () => {
    const response = await request(app).post("/upload");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No file uploaded");
  });

  it("should return 500 if file move fails", async () => {
    // Clean up default uploadDir created by global beforeEach
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
    // Create a file with the same name as the upload directory to cause mv to fail
    fs.writeFileSync(uploadDir, "this is a file, not a directory");

    const response = await request(app)
      .post("/upload")
      .attach("file", testFilePath);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to upload file");

    // Clean up the file we created
    if (fs.existsSync(uploadDir)) {
      fs.unlinkSync(uploadDir);
    }
    // Re-create the directory for other tests, though afterEach should handle it.
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });
});
