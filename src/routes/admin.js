import { Router } from "express";
import { runSeed } from "../seed/seed.js";

export const adminRouter = Router();

let isSeedRunning = false;

adminRouter.post("/seed", async (_req, res) => {
  if (isSeedRunning) {
    return res.status(409).json({
      error: "Seed is already running",
    });
  }

  isSeedRunning = true;

  // Run seeding in the background so the API responds quickly to the UI button.
  runSeed()
    .then(() => {
      console.log("[admin/seed] Seed run completed");
    })
    .catch((error) => {
      console.error("[admin/seed] Seed run failed:", error);
    })
    .finally(() => {
      isSeedRunning = false;
    });

  return res.status(202).json({
    message: "Seed started",
  });
});

