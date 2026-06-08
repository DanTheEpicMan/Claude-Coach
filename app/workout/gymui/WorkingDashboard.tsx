import { getExercisesForDay, getWorkoutDayId } from "../dbactions";
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import WorkoutForm from "@/app/workout/gymui/forms";

interface DashboardProps {
    searchParams: Promise<{ day?: string; index?: string }>;
}

export default async function WorkoutDashboard({ searchParams }: DashboardProps) {
    const { day, index } = await searchParams;

    if (!day) return <div>Error: No date provided in URL.</div>;
    const dayId: string = await getWorkoutDayId(day, parseInt(index || "0", 10));

    const workouts = await getExercisesForDay(day);
    const targetedWorkoutDay = workouts.find(w => w.day_index === parseInt(index || "0", 10));
    const exercises = targetedWorkoutDay ? targetedWorkoutDay.exercises : [];

    return (
        <div className="pageFormat">
            <p className="groupHeader">Workout for {day}: {index}</p>
            <WorkoutForm dayId={dayId} />
            {exercises.map((exercise) => (
                <div className="border-2 border-white rounded-xl p-4">
                    <p key={exercise.id}>{exercise.name}</p>
                </div>
            ))}
        </div>
    );
}
