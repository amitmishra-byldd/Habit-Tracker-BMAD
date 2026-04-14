import { createApp } from "./server.js";
import { connectDatabase } from "./config/database.js";
import { environment } from "./config/environment.js";

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(environment.port, () => {
      console.log(`✓ Server running at http://localhost:${environment.port}`);
      console.log(`✓ Environment: ${environment.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
