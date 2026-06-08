"use server";
import Link from "next/link";
import {Suspense} from "react";
import {deleteExercise, deleteWorkoutDay, getWorkoutDays, updateExerciseName} from "@/app/workout/dbactions";
import { Button } from "@/components/ui/button";
import CalendarPopup from "@/app/workout/calanderPopup";
import {revalidatePath} from "next/cache";
import {format} from "date-fns";
import {redirect} from "next/navigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";

async function handleNavigate(workoutDate: string, index: number) {
    "use server"
    //Timezones suck
    const goodDateFormat = typeof workoutDate === 'string'
        ? workoutDate
        : workoutDate.toISOString().split('T')[0];
    redirect(`/workout/gymui?day=${goodDateFormat}&index=${index}`);
}

async function handleDelete(dayId: string) { // or number, matching your DB type
    "use server"
    await deleteWorkoutDay(dayId);
    revalidatePath("/workout"); // Clears cache so the UI updates immediately
}

export async function WorkoutList() {
    const workoutDays = await getWorkoutDays();

    return (
        <ul className="flex flex-col gap-4">
            {workoutDays.map((day, index) => (
                <li key={day.id || index} className="flex justify-between items-center w-full">
                    <form action={handleNavigate.bind(null, day.workout_date, index)}>
                        <Button variant="outline" type="submit">
                            <p className="text-2xl font-bold">{day.workout_date} : {index}</p>
                        </Button>
                    </form>

                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </PopoverTrigger>

                            <PopoverContent>
                                <p>Are you sure?</p>
                                <form action={handleDelete.bind(null, day.id)}>
                                    <Button variant="destructive" type="submit">Delete</Button>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default async function workout() {

    return (
        <div className="pageFormat">

            <p className="groupHeader">Create a new workout or edit an existing one</p>
            <div className="mt-8">
                <Suspense fallback={null}>
                    <CalendarPopup />
                </Suspense>
            </div>

            <div className="dividerLineDiv"/>

            {/*TODO: Make the UL be a form that has buttons that passes arguments to a redirect function*/}
            <Suspense fallback={<p>Loading...</p>}>
                <WorkoutList />
            </Suspense>

        </div>
    );
}