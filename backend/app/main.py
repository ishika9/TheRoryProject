from fastapi import FastAPI
from app.db.database import engine
from app.db.base import Base
from app.routers import goals, tasks, study, ai, auth
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Rory Project API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(goals.router)
app.include_router(tasks.router)
app.include_router(study.router)
app.include_router(ai.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "The Rory Project is live 🚀"}



