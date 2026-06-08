// app/workout/gymui/error.tsx
"use client";
export default function Error({ error }: { error: Error }) {
    return <div className="p-6 text-red-400">caught: {error.message}</div>;
}