'use client'

import { useEffect } from 'react'

export default function RedirectComponent({ url }: { url: string }) {
    useEffect(() => {
        if (url) {
            window.location.href = url
        }
    }, [url])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center">
                <p className="text-lg text-gray-600">Redirecting to {url}...</p>
            </div>
        </div>
    )
}
