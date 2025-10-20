import os
import jwt
from datetime import datetime, timedelta

SECRET = os.getenv("DJANGO_SECRET_KEY", "dev-insecure")
ALG = "HS256"

def make_token(payload: dict, days: int = 7):
    now = datetime.utcnow()
    exp = now + timedelta(days=days)
    body = {**payload, "iat": int(now.timestamp()), "exp": int(exp.timestamp())}
    token = jwt.encode(body, SECRET, algorithm=ALG)
    return token, int(exp.timestamp())

def verify_token(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALG])