'use client';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || 'An unexpected error occurred.';

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div><h1>Error</h1></div>
            <div><p>{message}</p></div>
            <div><p>Press the back arrow to go to the previous page to retry the operation</p></div>
        </div>
    );
}