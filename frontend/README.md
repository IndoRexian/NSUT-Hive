# FRONTEND

docker build -t nshfrontend .

docker image ls

docker run -p 3000:3000 --name frontend --env-file .env \[id]