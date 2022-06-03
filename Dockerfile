FROM python:3.10-bullseye as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.1.12

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock ./

RUN poetry export -f requirements.txt | pip install --no-cache-dir -r /dev/stdin

FROM base as dev

WORKDIR /gotracker

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0", "--port=5000" ]

FROM node:16-alpine as build

WORKDIR /web

COPY ./web/app/package.json ./web/app/tsconfig.json ./web/app/yarn.lock ./

RUN yarn --prod

COPY ./web/app/src/ ./src/
COPY ./web/app/public/ ./public/

RUN yarn build

FROM base as prod

COPY ./go_tracker/ ./go_tracker/
COPY --from=build ./web/build/ ./web/app/
COPY ./*.py ./
COPY ./*.sh ./

EXPOSE $PORT

ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]