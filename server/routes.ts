import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertDogSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "dist/public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage_config,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const sessionStore = MemoryStore(session);

  // Setup session
  app.use(
    session({
      secret: "pawfinder-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new sessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  function isAuthenticated(req: Request, res: Response, next: any) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  }

  function isAdmin(req: Request, res: Response, next: any) {
    if (req.isAuthenticated() && (req.user as any).isAdmin) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  }

  // Auth routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Image upload route
  app.post("/api/upload", upload.array("images", 3), (req, res) => {
    const files = req.files as Express.Multer.File[];
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  });

  // Dogs routes
  app.get("/api/dogs", async (req, res) => {
    try {
      const breed = req.query.breed as string | undefined;
      const city = req.query.city as string | undefined;
      const query = req.query.query as string | undefined;
      
      const dogs = await storage.getDogsWithFilters({ breed, city, query });
      res.json(dogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dogs" });
    }
  });

  app.get("/api/dogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dog = await storage.getDogById(id);
      
      if (!dog) {
        return res.status(404).json({ message: "Dog not found" });
      }
      
      res.json(dog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dog details" });
    }
  });

  app.post("/api/dogs", async (req, res) => {
    try {
      const dogData = req.body;
      
      // Validate input
      const validationResult = insertDogSchema.safeParse(dogData);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: validationResult.error.format() });
      }
      
      const dog = await storage.createDog(dogData);
      res.status(201).json(dog);
    } catch (error) {
      res.status(500).json({ message: "Failed to create dog report" });
    }
  });

  // Config routes
  app.get("/api/config/mapbox", (req, res) => {
    const token = process.env.MAPBOX_ACCESS_TOKEN;
    if (!token) {
      return res.status(500).json({ message: "MapBox token not configured" });
    }
    res.json({ token });
  });
  
  // Admin routes
  app.patch("/api/admin/dogs/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["active", "claimed", "archived"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedDog = await storage.updateDogStatus(id, status);
      
      if (!updatedDog) {
        return res.status(404).json({ message: "Dog not found" });
      }
      
      res.json(updatedDog);
    } catch (error) {
      res.status(500).json({ message: "Failed to update dog status" });
    }
  });

  return httpServer;
}
