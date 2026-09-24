from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import home, data_analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home.router)
app.include_router(data_analysis.router)
