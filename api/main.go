package main

import (
    "github.com/gofiber/fiber/v2"
    _ "github.com/joho/godotenv/autoload"
    "github.com/kvdomingo/go-tracker/database"
    "log"
)

func main() {
    app := fiber.New(fiber.Config{
        ServerHeader:      "GOTracker",
        AppName:           "GO Tracker",
        EnablePrintRoutes: true,
        ColorScheme:       fiber.Colors{},
    })

    err := database.NewPool()
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }
    defer database.ClosePool()

    api := app.Group("/api")

    api.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("ok")
    })

    log.Fatal(app.Listen(":8000"))
}
