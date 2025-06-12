// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { clients } from '../app';

const router = express.Router();

router.get('/', async function (req, res) {
  // Set headers required for SSE to work properly
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Important for proxy servers and Azure App Service
  res.setHeader('X-Accel-Buffering', 'no');

  // Ensure all browsers get proper encoding
  res.setHeader('Content-Encoding', 'identity');

  // Flush headers immediately to establish the connection
  res.flushHeaders();

  // Create a unique client ID for logging and reconnection
  const clientId = Date.now();
  console.log(`Client ${clientId} connected to SSE endpoint`);

  // Add this client to the list of connected clients first
  clients.push(res);

  // Small delay to ensure client has time to set up listeners before sending initial events
  setTimeout(() => {
    // Only send events if the connection is still open
    if (!res.writableEnded) {
      // Send an initial event with ID for reconnection support
      res.write(`id: ${clientId}\n`);
      res.write(`event: connected\n`);
      res.write(`data: {"status":"connected","id":"${clientId}"}\n\n`);
      console.log(`Sent connection event to client ${clientId}`);
    }
  }, 100); // Small delay of 100ms

  // Keep connection alive with heartbeats
  const heartbeatInterval = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': heartbeat\n\n');
    }
  }, 30000); // 30 seconds heartbeat

  console.log(`Total connected clients: ${clients.length}`);

  // Remove the client when the connection is closed
  req.on('close', () => {
    clearInterval(heartbeatInterval);
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
      console.log(`Client ${clientId} disconnected, ${clients.length} clients remaining`);
    }
  });

  // Handle errors on the response stream
  res.on('error', (err) => {
    console.error(`Error on SSE connection for client ${clientId}:`, err);
    clearInterval(heartbeatInterval);
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

export default router;
