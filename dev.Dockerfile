FROM python:3.10-bullseye as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.2.2

WORKDIR /tmp

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false && poetry install

WORKDIR /backend

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0", "--port=5000" ]
