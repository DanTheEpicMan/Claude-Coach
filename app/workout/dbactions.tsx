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
            workout_date,
            day_index
        `)
        .order("workout_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch workout days:", error.message);
        return [];
    }

    return data;
}

export async function getWorkoutDayId(day: string, index: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("workout_days")
        .select("id")
        .eq("workout_date", day)
        .eq("day_index", index)
        .maybeSingle();

    if (error) {
        console.error(`Failed to find workout day ID for ${day} index ${index}:`, error.message);
        return null;
    }

    return data?.id;
}


//"yyyy-MM-dd"
export async function getNumberOfWorkoutsForDay(day: string) {
    let days = await getWorkoutDays();
    let numOfDays = 0;

    for (const item of days) {
        if (item.workout_date === day) {
            numOfDays++;
        }
    }

    return numOfDays;
}

//fetches the entire page TODO: Make this index specific
export async function getExercisesForDay(day: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("workout_days")
        .select(`
            id,
            workout_date,
            day_index,
            exercises (
                id,
                name,
                order_index,
                exercise_sets (
                    id,
                    set_number,
                    weight,
                    reps,
                    rest_time_seconds
                )
            )
        `)
        .eq("workout_date", day)
        // Sorts exercises by their layout position, and sets by their order
        .order("order_index", { foreignTable: "exercises", ascending: true })
        .order("set_number", { foreignTable: "exercises.exercise_sets", ascending: true });

    if (error) {
        console.error("Failed to fetch exercises for day:", error.message);
        return [];
    }

    return data;
}

export async function getNextSetAndPastWeight(exerciseId: string, currentSets: any[]) {
    const nextSetNumber = currentSets.length + 1;

    const supabase = await createClient();
    const { data } = await supabase
        .from("exercise_sets")
        .select("weight")
        .eq("exercise_id", exerciseId)
        .order("id", { ascending: false })
        .limit(1);

    const mostRecentWeight = data && data.length > 0 ? data[0].weight : 0;

    return {
        nextSetNumber,
        mostRecentWeight
    };
}


//----------------------------- Setter Methods -----------------------------
//on new day creation
//dateString: "yyyy-MM-dd"
//dayIndex: int
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
    revalidatePath("/workout/gymui");
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
    revalidatePath("/workout/gymui");
}

//----------------------------- Edit Methods -----------------------------

// Update an existing exercise's name
export async function updateExerciseName(exerciseId: string, newName: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("exercises")
        .update({ name: newName })
        .eq("id", exerciseId);

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    revalidatePath("/workout/gymui");
}

// Update the metrics of a specific set (e.g., user made a typo and needs to fix weight/reps)
export async function updateExerciseSet(setId: string, weight: number, reps: number, restTime: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("exercise_sets")
        .update({
            weight: weight,
            reps: reps,
            rest_time_seconds: restTime
        })
        .eq("id", setId);

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    revalidatePath("/workout/gymui");
}


//----------------------------- Delete Methods -----------------------------

// Delete an entire workout day
// NOTE: Make sure your foreign keys in Supabase for `exercises` and `exercise_sets` are set to "ON DELETE CASCADE".
// Otherwise, the database will block this deletion because child records still exist.
export async function deleteWorkoutDay(workoutDayId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("workout_days")
        .delete()
        .eq("id", workoutDayId)
        .eq("user_id", user.id); // Extra security: ensure the user owns the day they are deleting

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    revalidatePath("/workout/gymui");
}

// Delete a specific exercise (and its sets, assuming ON DELETE CASCADE is set up)
export async function deleteExercise(exerciseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", exerciseId);

    if (error) throw new Error(error.message);

    try {
        revalidatePath("/workout"); //i dont think these do anything
        revalidatePath("/workout/gymui");
    } catch {
        console.error("something not important happened badly");
    }
}

// Delete a specific set (e.g., user accidentally added too many sets)
export async function deleteExerciseSet(setId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("exercise_sets")
        .delete()
        .eq("id", setId);

    if (error) throw new Error(error.message);

    revalidatePath("/workout");
    revalidatePath("/workout/gymui");
}