start-development:
	docker-compose -f docker-compose.development.yml up -d --build
stop-development:
	docker-compose -f docker-compose.development.yml down; \
	docker image prune --all --force; \
	docker volume prune --all --force --filter "label!=DB_VOLUME_LABEL" ; \
	docker network prune --force
start-production:
	docker-compose -f docker-compose.production.yml up -d --build
stop-production:
	docker-compose -f docker-compose.production.yml down; \
	docker image prune --all --force; \
	docker volume prune --all --force --filter "label!=DB_VOLUME_LABEL" ; \
	docker network prune --force
