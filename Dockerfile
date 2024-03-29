FROM python:3.10-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.3.2

WORKDIR /tmp

RUN pip install "poetry==$POETRY_VERSION" && poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock ./

RUN poetry install

WORKDIR /backend

CMD [ "flask", "run", "--host=0.0.0.0", "--port=5000" ]
