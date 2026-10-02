from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import home, data_analysis

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://react-frontend.ambitiousbeach-dced774b.centralindia.azurecontainerapps.io",
        "http://localhost:5173",  # Replace 3000 with your local frontend port
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home.router)
app.include_router(data_analysis.router)
