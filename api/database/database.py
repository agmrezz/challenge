from sqlmodel import create_engine, Session, SQLModel

SQLITE_DATABASE_URL = "sqlite:///./aemet.db"

engine = create_engine(
    SQLITE_DATABASE_URL, connect_args={"check_same_thread": False}
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
