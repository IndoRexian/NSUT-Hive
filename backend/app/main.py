from api import auth, departments, professors, reviews, users
from core.config import Config
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from starlette.middleware.sessions import SessionMiddleware

config = Config()
app = FastAPI()
app.include_router(departments.router)
app.include_router(professors.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(reviews.router)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=config.APP_SECRET_KEY,
)


@app.exception_handler(OperationalError)
def db_connection_error_handler(request, exc):
    return HTTPException(
        status_code=503,
        detail="Unable to connect to the database. Please try again later.",
    )


print("Running at port 8000")
