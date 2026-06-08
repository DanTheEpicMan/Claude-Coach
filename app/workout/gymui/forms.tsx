// app/WorkoutForm.tsx
"use client";

import {useEffect, useRef, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {addExerciseToDay, deleteExercise, deleteExerciseSet, updateExerciseSet} from "@/app/workout/dbactions";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface WorkoutFormProps {
    dayId: string;
}

export default function WorkoutForm({ dayId }: { dayId: string }) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            action={async (formData) => {
                const workoutName = formData.get("workout") as string;
                await addExerciseToDay(dayId, workoutName);
                formRef.current?.reset();
            }}
            className="flex items-center gap-2 mb-6"
        >
            <div className="flex-1">
                <Input
                    id="workout"
                    name="workout"
                    type="text"
                    placeholder="Exercise: e.g. hammerstrength chest press"
                    className="bg-black border-slate-700 text-white"
                    required
                />
            </div>

            <Button type="submit">
                +
            </Button>
        </form>
    );
}

interface SetRowProps {
    setId: string;
    initialWeight: number;
    initialReps: number;
    initialRestTime: number;
}

export function SetRow({ setId, initialWeight, initialReps, initialRestTime }: SetRowProps) {
    const [weight, setWeight] = useState(initialWeight);
    const [reps, setReps] = useState(initialReps);
    const [restTime, setRestTime] = useState(initialRestTime);
    const [isTimerActive, setIsTimerActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive) {
            interval = setInterval(() => {
                setRestTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive]);

    const handleSave = async () => {
        try {
            await updateExerciseSet(setId, weight, reps, restTime);
        } catch (error) {
            console.error("Failed to update set:", error);
        }
    };

    const toggleTimer = async () => {
        if (isTimerActive) {
            setIsTimerActive(false);
            await handleSave();
        } else {
            setIsTimerActive(true);
        }
    };

    return (
        <div className="flex gap-2 items-center my-2">
            <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={handleSave}
                className="border p-1 w-12 rounded text-white bg-black hideArrows"
                placeholder="Weight"
            />
            <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                onBlur={handleSave}
                className="border p-1 w-12 rounded text-white bg-black hideArrows"
                placeholder="Reps"
            />

            {/* Rest Timer Group */}
            <div className="flex items-center gap-1">
                <input
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    onBlur={handleSave}
                    onFocus={() => setIsTimerActive(false)} // Auto-pause if user clicks to type
                    className={`border p-1 w-12 rounded bg-black hideArrows transition-colors duration-300 ${
                        isTimerActive ? "text-green-400 border-green-500" : "text-white"
                    }`}
                    placeholder="Rest"
                />
                <button
                    type="button"
                    onClick={toggleTimer}
                    className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                >
                    {isTimerActive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                            <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </button>
            </div>

            <div className="ml-auto">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="destructive">-</Button>
                    </PopoverTrigger>

                    <PopoverContent>
                        <p>Are you sure?</p>

                        <form action={async () => {
                            deleteExerciseSet(setId)
                        }}>
                            <Button variant="destructive" type="submit">Delete</Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}


