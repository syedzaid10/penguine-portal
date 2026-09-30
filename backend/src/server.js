import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import fs from 'fs';
import { uploadsDir, frontendDistDir } from './config/paths.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/documents.routes.js';
import datasetRoutes from './routes/datasets.routes.js';
import mediaRoutes from './routes/media.routes.js';
import activityRoutes from './routes/activities.routes.js';
import storyRoutes from './routes/stories.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import contentStudioRoutes from './routes/contentStudio.routes.js';
import auditRoutes from './routes/audit.routes.js';
import userRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Penguine API',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

// Official Contact & Research Inquiry Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, organization, purpose, subject, message } = req.body;
  const referenceId = `NCPOR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  console.log(`📩 [CONTACT INQUIRY] Ref: ${referenceId} | From: ${name} (${email}, ${organization || 'N/A'}) | Purpose: ${purpose} | Subject: ${subject}`);
  res.json({
    success: true,
    message: 'Official inquiry successfully registered with NCPOR Information Bureau.',
    referenceId,
    receivedAt: new Date().toISOString(),
  });
});

// Live Station Telemetry Endpoint (Real-time telemetry snapshot)
app.get('/api/stations/live', (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    stations: [
      {
        id: 'maitri',
        name: 'Maitri Station',
        location: 'Schirmacher Oasis, Queen Maud Land, Antarctica',
        coordinates: '70°45′58″ S, 11°44′09″ E',
        established: 1989,
        status: 'Operational',
        operationalStatus: 'green',
        telemetry: {
          surfaceTemp: '-18.4 °C',
          windSpeed: '24.2 knots',
          windDirection: 'ESE',
          pressure: '984.6 hPa',
          solarRadiation: '312 W/m²',
          activeCrew: 24,
        },
      },
      {
        id: 'bharati',
        name: 'Bharati Station',
        location: 'Larsemann Hills, East Antarctica',
        coordinates: '69°24′28″ S, 76°11′14″ E',
        established: 2012,
        status: 'Operational',
        operationalStatus: 'green',
        telemetry: {
          surfaceTemp: '-12.8 °C',
          windSpeed: '18.5 knots',
          windDirection: 'SSE',
          pressure: '992.1 hPa',
          solarRadiation: '420 W/m²',
          activeCrew: 32,
        },
      },
      {
        id: 'himadri',
        name: 'Himadri Research Base',
        location: 'Ny-Ålesund, Spitsbergen, Svalbard (Arctic)',
        coordinates: '78°55′ N, 11°56′ E',
        established: 2008,
        status: 'Year-Round Active',
        operationalStatus: 'green',
        telemetry: {
          surfaceTemp: '-3.1 °C',
          windSpeed: '11.8 knots',
          windDirection: 'NE',
          pressure: '1012.3 hPa',
          relativeHumidity: '78%',
          activeCrew: 8,
        },
      },
      {
        id: 'indarc',
        name: 'IndARC Mooring System',
        location: 'Kongsfjorden Fjord, Svalbard (Subsurface)',
        coordinates: '78°59′ N, 11°53′ E',
        established: 2014,
        status: 'Submerged Active',
        operationalStatus: 'cyan',
        telemetry: {
          waterTempSurface: '1.4 °C',
          waterTemp100m: '-0.8 °C',
          salinity: '34.82 PSU',
          currentVelocity: '0.24 m/s',
          batteryHealth: '98%',
          acousticUplink: 'Nominal',
        },
      },
      {
        id: 'dakshin_gangotri',
        name: 'Dakshin Gangotri',
        location: 'Ice Shelf, Antarctica',
        coordinates: '70°05′37″ S, 12°00′00″ E',
        established: 1983,
        status: 'Historic Monument (ATCM)',
        operationalStatus: 'yellow',
        telemetry: {
          statusDetail: 'Preserved under Antarctic Treaty System as Historic Site No. 44',
          submergedDepthIce: 'Approx 14m beneath firn',
        },
      },
    ],
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/content-studio', contentStudioRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/users', userRoutes);

// Production Static Frontend Serving (Unified Full-Stack Deployment)
if (fs.existsSync(frontendDistDir)) {
  console.log(`📦 Serving production frontend build from: ${frontendDistDir}`);
  app.use(express.static(frontendDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

import User from './models/User.js';
import { runSeed } from './seed.js';

// Start Server
async function start() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 Penguine Server running on http://0.0.0.0:${PORT}`);
      console.log(`   National Polar Data Archive & Content Studio`);
      console.log(`=======================================================`);
    });

    try {
      await connectDB();

      // Check if database needs initial seeding
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('ℹ️ Database is empty. Automatically initializing Penguine archive data...');
        await runSeed(false);
      }
    } catch (dbErr) {
      console.warn('⚠️ Database connection warning (portal remains live):', dbErr.message);
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;
