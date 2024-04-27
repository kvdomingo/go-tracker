-- name: ListProviders :many
SELECT *
FROM provider;

-- name: GetProvider :one
SELECT *
FROM provider
WHERE id = $1;


-- name: CreateProvider :one
INSERT INTO provider (name, website)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateProvider :one
UPDATE provider
SET name    = $2,
    website = $3
WHERE id = $1
RETURNING *;

-- name: DeleteProvider :exec
DELETE
FROM provider
WHERE id = $1;
