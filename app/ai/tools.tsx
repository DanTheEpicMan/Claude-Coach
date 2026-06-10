const tools = [
    {
        name: "query_db",
        description:
            "Run ONE read-only SQL SELECT against the current user's workout data. " +
            "Only this user's rows are ever visible. Use it for history, progression, recent sets. " +
            "Schema: workout_days(id, user_id, workout_date, day_index, created_at); " +
            "exercises(id, workout_day_id, name, order_index, created_at); " +
            "exercise_sets(id, exercise_id, set_number, weight, reps, rest_time_seconds, created_at).",
        input_schema: {
            type: "object",
            properties: { sql: { type: "string", description: "A single SELECT statement." } },
            required: ["sql"],
        },
    },
    {
        name: "write_workout",
        description:
            "Create a prescribed workout for the user on a date. Do NOT pass any id or index — " +
            "placement is handled so it never overwrites the user's own logged workout.",
        input_schema: {
            type: "object",
            properties: {
                workout_date: { type: "string", description: "YYYY-MM-DD" },
                exercises: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            sets: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        weight: { type: "number" },
                                        reps: { type: "integer" },
                                        rest: { type: "integer", description: "seconds" },
                                    },
                                    required: ["weight", "reps"],
                                },
                            },
                        },
                        required: ["name", "sets"],
                    },
                },
            },
            required: ["workout_date", "exercises"],
        },
    },
    {
        name: "update_brief",
        description:
            "Overwrite the user's persistent coaching brief (standing plan/notes that survive across chats). Pass the full new content.",
        input_schema: {
            type: "object",
            properties: { content: { type: "string" } },
            required: ["content"],
        },
    },
];