/*
should not be affected by a reload of the page, maybe just save to DB on a new line being entered into program

**Phone cannot fall asleep on this screen
* Custom keyboard (numbers always, arrows to goto next/previous box)
* Claude should be able to populate the exercise but not number of sets

1) enter a workout free-form OR have it be auto populated from a higher source (claude) (DB interaction)
 - Interaction with the DB, specifically writing workouts should be external so claude agent can also utilize it
2) enter weight
3) eneter reps + info about failure
4) rest timer/manual editing
5) keyboard button for "next set", autopopulates the weight, this will also push to DB
*/


import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import {Suspense} from "react";
import {getWorkoutDays} from "@/app/workout/dbactions";

function WorkoutPopup() {
    const [taskName, setTaskName] = React.useState("");
    const [date, setDate] = React.useState<Date | undefined>(new Date()); // Defaults to today

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting to Supabase:", { taskName, date });
    };

    return(
        <Dialog>
            <DialogTrigger>
                <Button variant="default">Create New Workout</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Workout</DialogTitle>
                    <DialogDescription>
                        Add a new workout day
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                    <Label>Target Date</Label>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button" // Essential so it doesn't accidentally trigger form submit
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={date} onSelect={setDate} />
                        </PopoverContent>
                    </Popover>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default async function workout() {

    return (
        <div className="pageFormat">

            <p className="groupHeader">Create a new workout or edit an existing one</p>
            <Link href="/workout/gymui/" passHref>
                <Button variant="default">Create New Workout</Button>
            </Link>

            <div className="dividerLineDiv"/>

            {/*TODO: Make the UL be a form that has buttons that passes arguments to a redirect function*/}
            <Suspense fallback={<p>Loading...</p>}>
                <ul>
                    {(await getWorkoutDays()).map((day, index) => (

                        <li key={index}>{day.id} {day.workout_date}</li>
                    ))}
                </ul>
            </Suspense>

        </div>
    );
}
