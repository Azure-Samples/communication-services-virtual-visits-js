# Devcontainer Quick Start

This devcontainer is pre-configured for Azure Communication Services Virtual Visits development.

## 🚀 Getting Started

1. **Dependencies**: Already installed automatically when the container was created
2. **Start Development**: Run the following command to start both client and server in development mode:

```bash
cd client && npm run start:project
```

This will:
- Start the server on port 8080 (Express/Node.js)
- Start the client on port 3000 (React/webpack-dev-server) 
- Enable hot reload for both client and server
- Open the app at `http://localhost:3000`

## 🔧 Environment Variables

To fully use the application, you'll need to configure environment variables. See the main [README.md](../README.md#environment-variables) for details.

Key environment variables to set:
- `VV_COMMUNICATION_SERVICES_CONNECTION_STRING`: Your Azure Communication Services connection string
- `VV_COMPANY_NAME`: Your company name (e.g., "Lamna Healthcare")
- `VV_COLOR_PALETTE`: Primary color (e.g., "#0078d4")

## 🎯 Available Routes

Once running, access these routes:
- **Client**: http://localhost:3000
  - `/book` - Booking interface
  - `/visit` - Virtual visit interface
- **Server**: http://localhost:8080
  - `/config` - Configuration API
  - Other server APIs

## 📝 Development Commands

From the `/client` directory:
- `npm run start:project` - Start both client and server
- `npm run start:client` - Start only client
- `npm run build:project` - Build both client and server

From the `/server` directory:
- `npm run start:server` - Start only server
- `npm run build:server` - Build only server

For more details, see the main [README.md](../README.md).