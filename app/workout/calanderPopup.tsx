"use client";

import {Suspense, useState} from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {getWorkoutDays, getNumberOfWorkoutsForDay, createWorkoutDay} from "@/app/workout/dbactions";
import {redirect} from "next/navigation";


export default function WorkoutPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [isExecuting, setIsExecuting] = useState(false);

    const router = useRouter();

    const newWorkoutFromButtonPress = async () => {
        if (!date || isExecuting) return;

        try {
            setIsExecuting(true);

            const goodDateFormat = format(date, "yyyy-MM-dd");
            const index = await getNumberOfWorkoutsForDay(goodDateFormat);

            const newWorkoutDay = await createWorkoutDay(goodDateFormat, index);

            setIsOpen(false);
            setIsExecuting(false);
            router.push(`/workout/gymui?day=${goodDateFormat}&index=${index}`);
        } catch (error) {
            console.error("Failed to create workout:", error);
            setIsExecuting(false);
        }
    };

    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Workout</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make New Workout</DialogTitle>
                    <DialogDescription>Choose a date the workout took place</DialogDescription>
                </DialogHeader>

                <div className="py-6 flex flex-col gap-4 text-sm">
                    <label className="font-medium">Date</label>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
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
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <DialogFooter>
                    <Button
                        onClick={newWorkoutFromButtonPress}
                        disabled={!date || isExecuting}
                    >
                        {isExecuting ? "Executing..." : "Confirm Action"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>)
}