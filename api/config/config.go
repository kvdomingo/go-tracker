package config

import (
    "fmt"
    "os"
)

func GetEnv(key string) string {
    env := os.Getenv(key)
    if env == "" {
        panic(fmt.Sprintf("Missing env: %s", key))
    }
    return env
}

func GetEnvWithDefault(key string, defaultValue string) string {
    env := os.Getenv(key)
    if env == "" {
        return defaultValue
    }
    return env
}

func DatabasePassword() string {
    return GetEnv("POSTGRESQL_PASSWORD")
}

func DatabaseUsername() string {
    return GetEnv("POSTGRESQL_USERNAME")
}

func DatabaseName() string {
    return GetEnv("POSTGRESQL_DATABASE")
}

func DatabaseHost() string {
    return GetEnvWithDefault("POSTGRESQL_HOST", "postgres")
}

func DatabasePort() string {
    return GetEnvWithDefault("POSTGRESQL_PORT", "5432")
}

func DatabaseUrl() string {
    return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
        DatabaseUsername(),
        DatabasePassword(),
        DatabaseHost(),
        DatabasePort(),
        DatabaseName(),
    )
}
