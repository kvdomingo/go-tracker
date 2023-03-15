FROM node:16-alpine as build

WORKDIR /tmp

COPY ./ui/ ./

RUN yarn install && yarn build

FROM python:3.10-bullseye as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.3.2

WORKDIR /tmp

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock ./

RUN poetry export -f requirements.txt | pip install --no-cache-dir -r /dev/stdin

WORKDIR /backend

COPY ./go_tracker/ ./go_tracker/
COPY --from=build /tmp/dist/ ./ui/
COPY ./*.py ./

EXPOSE $PORT

ENTRYPOINT [ "/bin/sh", "-c", "exec gunicorn --bind 0.0.0.0:$PORT --config gunicorn.conf.py" ]
