CREATE TABLE provider
(
    id      VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name    VARCHAR(255)            NOT NULL,
    website VARCHAR(255)
);

CREATE TYPE order_status as ENUM (
    'UNPAID',
    'PARTIALLY_PAID',
    'FULLY_PAID',
    'SHIPPED',
    'DELIVERED'
    );

CREATE TABLE group_order
(
    id                   VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    provider_id          VARCHAR(36)             REFERENCES provider (id) ON DELETE SET NULL,
    name                 VARCHAR(255)            NOT NULL,
    order_number         VARCHAR(255)            NOT NULL,
    order_date           DATE                    NOT NULL DEFAULT current_date,
    downpayment_deadline DATE,
    payment_deadline     DATE                    NOT NULL,
    status               order_status            NOT NULL DEFAULT 'UNPAID',
    total_balance        DECIMAL(2)                       DEFAULT 0.00,
    remaining_balance    DECIMAL(2)                       DEFAULT 0.00
);
