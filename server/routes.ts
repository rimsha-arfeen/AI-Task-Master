import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { analyzeJavascript } from "./analyzers/javascript";
import { analyzePython } from "./analyzers/python";
import { analysisSchema } from "@shared/schema";

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only js, jsx, py files
    const allowedExtensions = [".js", ".jsx", ".py"];
    const fileExt = file.originalname.split(".").pop();
    if (!fileExt || !allowedExtensions.includes(`.${fileExt.toLowerCase()}`)) {
      return cb(new Error("Only .js, .jsx, and .py files are allowed"));
    }
    cb(null, true);
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Add API routes
  app.post("/api/analyze-code", upload.single("file"), async (req: Request, res: Response) => {
    try {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const fileContent = file.buffer.toString("utf-8");
      const fileExt = file.originalname.split(".").pop()?.toLowerCase();

      if (!fileExt) {
        return res.status(400).json({ message: "Could not determine file extension" });
      }

      let analysisResult;

      // Choose analyzer based on file extension
      if (fileExt === "js" || fileExt === "jsx") {
        analysisResult = await analyzeJavascript(fileContent, file.originalname);
      } else if (fileExt === "py") {
        analysisResult = await analyzePython(fileContent, file.originalname);
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      // Validate the analysis result
      const validationResult = analysisSchema.safeParse(analysisResult);
      if (!validationResult.success) {
        console.error("Validation error:", validationResult.error);
        return res.status(500).json({ message: "Error generating analysis result" });
      }

      // Return the analysis result
      return res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Error analyzing code:", error);
      return res.status(500).json({ message: "Error analyzing code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
