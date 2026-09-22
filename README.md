# TrustShield AI

TrustShield AI is a unified AI-powered Digital Trust Platform. It provides capabilities for deepfake detection, URL scanning, and real-time content monitoring.

## Architecture

This is a monorepo structured with `pnpm` workspaces:
- `apps/web`: Next.js 15 frontend application.
- `apps/api`: FastAPI backend.
- `apps/extension`: Chrome Extension Manifest V3.
- `packages/shared`: Shared TypeScript definitions and utilities.

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Python 3.11+
- Docker (optional)

### Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start development servers:
   ```bash
   pnpm dev
   ```

### Docker
Run the entire stack using Docker Compose:
```bash
docker-compose up --build
```
