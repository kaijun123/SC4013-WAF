include .env

# Server + Database (Docker Compose)
# compose-build:
# 	docker compose build --no-cache

# compose-up:
# 	docker compose up --quiet-pull --remove-orphans

# compose-down:
# 	docker compose down --remove-orphans

# start: compose-build compose-up

db:
	docker run -d --name some-mongo \
	-p 27017:27017 \
	-e MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME} \
	-e MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD} \
	mongo

