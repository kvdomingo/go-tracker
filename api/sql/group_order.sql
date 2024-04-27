-- name: ListGroupOrders :many
SELECT *
FROM group_order;

-- name: GetGroupOrder :one
SELECT *
FROM group_order
WHERE id = $1;

-- name: CreateGroupOrder :one
INSERT INTO group_order (provider_id, name, order_number, order_date, downpayment_deadline, payment_deadline, status,
                         total_balance, remaining_balance)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: UpdateGroupOrder :one
UPDATE group_order
SET provider_id          = $2,
    name                 = $3,
    order_number         = $4,
    order_date           = $5,
    downpayment_deadline = $6,
    payment_deadline     = $7,
    status               = $8,
    total_balance        = $9,
    remaining_balance    = $10
WHERE id = $1
RETURNING *;

-- name: DeleteGroupOrder :exec
DELETE
FROM group_order
WHERE id = $1;
