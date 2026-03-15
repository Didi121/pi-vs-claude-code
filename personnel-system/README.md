# Personnel Management System - DevOps Setup

This directory contains the DevOps configuration for the Personnel Management System project.

## Structure

- `backend/` – Backend service (Node.js/Express)
- `frontend/` – Frontend service (React)
- `k8s/` – Kubernetes manifests for staging/production
- `.github/workflows/` – CI/CD pipelines

## Local Development

1. Ensure Docker and Docker Compose are installed.
2. Run `docker-compose up` in this directory to start:
   - PostgreSQL database (port 5432)
   - Backend API (port 3000)
   - Frontend (port 80)

## CI/CD Pipeline

- **CI**: Runs on every push to `main` and `develop` branches:
  - Linting and unit tests for backend
  - Build and tests for frontend
- **CD**: Deploys to staging environment when pushing to `develop` branch (requires Docker Hub credentials and Kubernetes cluster configured).

## Staging Environment

The staging environment is defined using Kubernetes manifests in `k8s/`. To deploy:

1. Build and push Docker images to a container registry.
2. Apply the manifests: `kubectl apply -f k8s/`

## Next Steps

- Configure actual container registry (Docker Hub, GitHub Container Registry, etc.)
- Set up Kubernetes cluster (e.g., using Google Cloud GKE, AWS EKS, or local Kind)
- Add Terraform scripts for infrastructure provisioning
- Configure monitoring (Prometheus, Grafana)
- Set up logging (ELK stack or Loki)
- Implement secrets management (external secrets operator)