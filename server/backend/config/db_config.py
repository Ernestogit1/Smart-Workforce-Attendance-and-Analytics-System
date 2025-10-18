import os
from mongoengine import connect

_connection = None

def connect_mongo():
    global _connection
    if _connection:
        return _connection
    uri = os.getenv("MONGO_URI") or os.getenv("MONGODB")
    if not uri:
        raise RuntimeError("Missing MONGO_URI in .env")
    _connection = connect(host=uri, alias="default")
    return _connection