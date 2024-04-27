FROM cosmtrek/air:v1.51.0

WORKDIR /app

COPY api/go.mod api/go.sum ./

RUN go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest && \
    go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest && \
    go mod download

CMD [ "air", "-c", ".air.toml" ]
