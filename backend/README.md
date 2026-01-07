# BACKEND

To copy DBs

pg_dump --no-owner --no-acl --dbname=postgresql://postgres:indorexian@localhost:5432/rmp | psql --dbname=postgres://zajfms0a:0eWcLZ7NrMJq@postgres-service-yueq3.db.eu-east-1.onmiget.com:5432/oqok8mjq

docker build -t nshbackend .

docker image ls

docker run -p 8000:8000 --name backend --env-file .env \[id]