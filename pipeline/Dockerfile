FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir sqlalchemy psycopg2-binary python-dotenv asyncpg

COPY backend ./backend
COPY pipeline ./pipeline

WORKDIR /app/pipeline

CMD ["python", "run_pipeline.py"]
