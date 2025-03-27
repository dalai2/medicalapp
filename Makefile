# Makefile for managing the project

# Variable Definitions
DOCKER_COMPOSE=docker-compose

# Build and run the Docker containers
run:
	$(DOCKER_COMPOSE) up --build

# Stop the Docker containers
stop:
	$(DOCKER_COMPOSE) down

# Clean the Docker build and stop the containers.
clean: stop
	$(DOCKER_COMPOSE) down -v --rmi local

# Install dependencies (within the Docker container)
install:
	$(DOCKER_COMPOSE) run --rm app npm install

# Run tests (within the Docker container)
test:
	$(DOCKER_COMPOSE) run --rm app npm test

# Run the server in watch mode (within the Docker container)
watch:
	$(DOCKER_COMPOSE) run --rm --service-ports app npm run dev