import React from "react";

export default function LoadingOverlay({ isLoading }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in-95 duration-200 w-11/12 max-w-sm relative overflow-hidden">
                {/* Efek Latar Belakang Abstrak (Opsional) */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

                {/* Animasi SVG */}
                <div className="relative flex justify-center items-center w-20 h-20 mb-6">
                    {/* Lingkaran Luar (Berdenyut/Ping) */}
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full w-full h-full animate-ping opacity-50"></div>

                    {/* Lingkaran Spinner Utama */}
                    <svg
                        className="absolute w-full h-full text-blue-600 animate-spin"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="80 200"
                            className="opacity-80"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="34"
                            stroke="#818cf8"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="60 150"
                            className="opacity-60"
                            style={{ animationDirection: "reverse" }}
                        />
                    </svg>

                    {/* Ikon Tengah (Petir / AI Thinking) */}
                    <svg
                        className="w-8 h-8 text-blue-600 animate-pulse relative z-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>

                <h3 className="text-xl font-extrabold text-gray-800 text-center tracking-tight mb-2 z-10">
                    Menyiapkan Materi...
                </h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed z-10">
                    AI sedang menyusun dan merangkum materi pembelajaran khusus
                    untuk Anda.
                </p>
            </div>
        </div>
    );
}
