import app from "./src/App";
import dotenv from "dotenv";
console.log("hello world");
const port = 3000;

dotenv.config();
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
