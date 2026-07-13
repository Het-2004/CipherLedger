# 🚢 Deployment Guide

CipherLedger is containerized for easy deployment across development and production environments.

## Docker Compose

The `docker-compose.yml` file provides the base services (Redis, MongoDB for block indexing).
The `docker-compose.multi-node.yml` spins up a local P2P network of several CipherLedger nodes.
The `docker-compose.monitoring.yml` adds Prometheus and Grafana for metrics.

### Starting a Multi-Node Network
```bash
docker-compose -f docker-compose.multi-node.yml up -d
```

## Kubernetes (K8s)

The `k8s/` directory contains manifests for deploying CipherLedger to a Kubernetes cluster.

### Deploying to K8s
1. **Apply configurations and secrets**:
   ```bash
   kubectl apply -f k8s/configmap.yaml
   ```
2. **Deploy persistent storage & databases**:
   ```bash
   kubectl apply -f k8s/redis-mongodb-deployment.yaml
   ```
3. **Deploy the CipherLedger Nodes**:
   ```bash
   kubectl apply -f k8s/cipherledger-deployment.yaml
   kubectl apply -f k8s/cipherledger-service.yaml
   ```

### Monitoring via Prometheus
Ensure the metrics endpoints (`/actuator/prometheus`) are scraped by configuring your cluster's Prometheus operator with the provided `config/prometheus.yml`.
