## Scrum App

.DEFAULT_GOAL := help

.PHONY: help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?## .*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[36m##/[33m/'

DOCKER_COMPOSE=docker-compose

##
## Setup
## -----

.PHONY: install
install:  ## Installs the project

.PHONY: start
start: ## Start the project
	$(DOCKER_COMPOSE) up

.PHONY: stop
stop: ## Stop the project
	$(DOCKER_COMPOSE) down


.PHONY: client-sh
client-sh: ## Client shell
	$(DOCKER_COMPOSE) run --rm --entrypoint /bin/sh client

.PHONY: server-sh
server-sh: ## Server shell
	$(DOCKER_COMPOSE) run --rm --entrypoint /bin/sh server


.PHONY: build
build: ## Build the docker containers
	$(DOCKER_COMPOSE) stop
