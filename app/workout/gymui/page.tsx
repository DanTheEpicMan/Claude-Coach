import {
    getExercisesForDay,
    getWorkoutDayId,
    addSetToExercise,
    getNextSetAndPastWeight,
    deleteExercise, addExerciseToDay, updateExerciseName
} from "@/app/workout/dbactions";
import WorkoutForm, {SetRow} from "@/app/workout/gymui/forms";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {revalidatePath} from "next/cache";
import {Input} from "@/components/ui/input";

interface PageProps {
    searchParams: Promise<{ day?: string; index?: string }>;
}

export default async function GymUIPage({ searchParams }: PageProps) {
    const { day, index } = await searchParams;

    if (!day) return <div className="p-6">Error: No date provided in URL.</div>;

    const dayId = await getWorkoutDayId(day, parseInt(index || "0", 10));
    const workouts = await getExercisesForDay(day);
    const targetedWorkoutDay = workouts.find(w => w.day_index === parseInt(index || "0", 10));
    const exercises = targetedWorkoutDay ? targetedWorkoutDay.exercises : [];

    return (
        <div className="p-6">
            <div className="pageFormat">
                <p className="groupHeader">Workout for {day}: {index}</p>
                <WorkoutForm dayId={dayId} />
                {exercises.map((exercise) => (
                    <div key={exercise.id} className="roundEdgeWhiteOutlineDiv">
                        <div className="flex items-center gap-2 mb-6">
                            <p className="text-1xl font-bold flex-1">{exercise.name}</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="secondary">Edit Name</Button>
                                </PopoverTrigger>

                                <PopoverContent className="flex flex-col gap-4">
                                    <p>Enter A Name</p>

                                    <form action={async (formData) => {
                                        "use server";
                                        const workoutName = formData.get("workout") as string;
                                        await updateExerciseName(exercise.id, workoutName);
                                    }} className="flex flex-col gap-3"
                                    >
                                        <Button variant="secondary" type="submit">Change</Button>
                                        <Input
                                            id="workout"
                                            name="workout"
                                            type="text"
                                            placeholder="hammerstrength chest press"
                                            className="bg-black border-slate-700 text-white"
                                            required
                                        />
                                    </form>
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="destructive">-</Button>
                                </PopoverTrigger>

                                <PopoverContent>
                                    <p>Are you sure?</p>

                                    <form action={async () => {
                                        "use server";

                                        deleteExercise(exercise.id);
                                        revalidatePath("/workout");
                                        revalidatePath("/workout/gymui");
                                    }}>
                                        <Button variant="destructive" type="submit">Delete</Button>
                                    </form>
                                </PopoverContent>
                            </Popover>

                            <form action={async () => {
                                "use server";

                                const { nextSetNumber, mostRecentWeight } = await getNextSetAndPastWeight(
                                    exercise.id,
                                    exercise.exercise_sets || []
                                );

                                await addSetToExercise(
                                    exercise.id,
                                    nextSetNumber,
                                    mostRecentWeight,
                                    0,
                                    0
                                );
                            }}>
                                <Button variant="default" type="submit">+</Button>
                            </form>
                        </div>
                        <div className="ml-4">
                            <p className="whitespace-pre-wrap">   lbs    |   rep   |   Rest Sec</p>
                            {exercise.exercise_sets?.map((set) => (
                                <SetRow
                                    key={set.id}
                                    setId={set.id}
                                    initialWeight={set.weight}
                                    initialReps={set.reps}
                                    initialRestTime={set.rest_time_seconds}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
