//create an express application with swagger-ui-express and swagger-jsdoc
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import pino from "pino";
import fs from "fs";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Data Visualization API",
      version: "1.0.0",
      description: "Data Visualization API",
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
  },
  apis: ["./**/*.ts"], // Path to the API docs
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a hello world message
 *     responses:
 *       200:
 *         description: A hello world message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Hello World!
 */
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello World!");
});
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: No file uploaded
 *       500:
 *         description: File upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: file uploaded failed
 *
 */
import { UploadedFile } from "express-fileupload";

app.post("/upload", (req: Request, res: Response) => {
  const file = req.files?.file as UploadedFile | UploadedFile[] | undefined;
  if (!file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  // Handle both single and multiple file uploads
  const filesArray = Array.isArray(file) ? file : [file];

  const uploadDir = path.join(__dirname, "UploadedFiles");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  try {
    filesArray.forEach((f) => {
      const uploadPath = path.join(uploadDir, f.name);
      f.mv(uploadPath, (err) => {
        if (err) {
          throw err;
        }
      });
    });
    res.send({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).send({ message: "Failed to upload file" });
  }
});

export default app;
