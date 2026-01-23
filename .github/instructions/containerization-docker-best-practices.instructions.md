---
applyTo: '**/Dockerfile,**/Dockerfile.*,**/*.dockerfile,**/docker-compose*.yml,**/docker-compose*.yaml'
description: 'Docker best practices for optimized, secure, and efficient containers'
---

# Docker & Containerization Best Practices

## Core Principles

- **Immutability:** Once built, images shouldn't change; create new versions instead
- **Portability:** Containers run consistently across environments
- **Isolation:** Each container has isolated processes and resources
- **Efficiency:** Smaller images are faster to build, push, pull, and more secure

## Dockerfile Best Practices

### 1. Multi-Stage Builds
Separate build dependencies from runtime dependencies:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 2. Choose Minimal Base Images
- Prefer `alpine`, `slim`, or `distroless` variants
- Use official images from Docker Hub
- Specify exact versions (avoid `latest` in production)
- Example: `node:18-alpine`, `python:3.9-slim`, `openjdk:17-jre-slim`

### 3. Optimize Layer Caching
Order instructions from least to most frequently changing:

```dockerfile
# Copy dependency files first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source code last (changes frequently)
COPY src/ ./src/
```

### 4. Use .dockerignore
Exclude unnecessary files from build context:

```dockerignore
.git*
node_modules
*.log
.env*
.vscode
dist
build
test/
coverage/
.DS_Store
```

### 5. Minimize Layers
Combine related commands to reduce layers:

```dockerfile
# GOOD: Combined commands with cleanup
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install flask && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# BAD: Multiple layers without cleanup
RUN apt-get update
RUN apt-get install -y python3
RUN pip3 install flask
```

### 6. Run as Non-Root User
```dockerfile
# Create dedicated user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser
```

### 7. Use Environment Variables
```dockerfile
# Set defaults
ENV NODE_ENV=production
ENV PORT=3000

# Application reads from environment
CMD ["node", "dist/main.js"]
```

### 8. Implement Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1
```

## Security Best Practices

### 1. Non-Root Execution
Always run containers as non-root user to minimize security risks

### 2. Minimal Base Images
Fewer packages = fewer vulnerabilities and smaller attack surface

### 3. Scan for Vulnerabilities
```bash
# Use Trivy for scanning
docker build -t myapp .
trivy image myapp

# Use Hadolint for Dockerfile linting
docker run --rm -i hadolint/hadolint < Dockerfile
```

### 4. No Secrets in Images
```dockerfile
# BAD: Never do this
COPY secrets.txt /app/

# GOOD: Use runtime secrets
# Application reads from environment or mounted secrets
```

### 5. Security Headers & Capabilities
```bash
# Drop unnecessary capabilities
docker run --cap-drop=ALL --security-opt=no-new-privileges myapp
```

## Runtime Best Practices

### 1. Resource Limits
```yaml
# docker-compose.yml
services:
  app:
    image: myapp:latest
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 2. Logging
Use STDOUT/STDERR for container logs:
```javascript
// Application logs to console
console.log(JSON.stringify({ level: 'info', message: 'Server started' }));
```

### 3. Persistent Storage
```yaml
services:
  database:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4. Networking
```yaml
services:
  web:
    networks:
      - frontend
      - backend
  api:
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true
```

## Docker Compose Best Practices

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  database:
    image: postgres:13-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    secrets:
      - db_password
    restart: unless-stopped

volumes:
  postgres_data:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## Dockerfile Review Checklist

- [ ] Multi-stage build used (if applicable)
- [ ] Minimal base image (alpine/slim/distroless)
- [ ] Layers optimized and combined
- [ ] .dockerignore file present
- [ ] Non-root USER defined
- [ ] EXPOSE instruction for documentation
- [ ] Environment variables for configuration
- [ ] HEALTHCHECK defined
- [ ] No secrets in image layers
- [ ] Security scanning integrated (Trivy, Hadolint)

## Common Issues & Solutions

### Large Image Size
- Use multi-stage builds
- Choose smaller base images
- Clean up in same RUN command
- Review `docker history <image>`

### Slow Builds
- Optimize layer caching order
- Use .dockerignore effectively
- Leverage build cache

### Security Vulnerabilities
- Scan images regularly
- Update base images
- Remove unnecessary packages
- Run as non-root user

### Performance Issues
- Set resource limits
- Monitor container metrics
- Use health checks for orchestration
- Implement proper logging
