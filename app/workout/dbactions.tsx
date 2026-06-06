"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

//----------------------------- Getter Methods -----------------------------
export async function getWorkoutDays() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("workout_days")
        .select(`
            id,
            workout_date
        `)
        .order("workout_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch workout days:", error.message);
        return [];
    }

    return data;
}



//----------------------------- Setter Methods -----------------------------
//on new day creation
export async function createWorkoutDay(dateString: string, dayIndex: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("workout_days")
        .insert([{
            user_id: user.id,
            workout_date: dateString,
            day_index: dayIndex
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    return data;
}

//on new exercise button press
export async function addExerciseToDay(workoutDayId: string, exerciseName: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("exercises")
        .insert([{
            workout_day_id: workoutDayId, //connect to parent
            name: exerciseName
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    return data;
}

//used when adding a new row/just when the rest time ends
export async function addSetToExercise(exerciseId: string, setNum: number, weight: number, reps: number, restTime: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("exercise_sets")
        .insert([{
            exercise_id: exerciseId, // Connects this performance record to its parent exercise
            set_number: setNum,
            weight: weight,
            reps: reps,
            rest_time_seconds: restTime
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
}