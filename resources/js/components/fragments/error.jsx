import React from "react";
import { XCircle } from "lucide-react";

export default function ErrorModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in-95 duration-200 w-11/12 max-w-sm relative overflow-hidden text-center">
                {/* Efek Latar Belakang Merah Tipis */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-60"></div>

                {/* Ikon Error */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 relative z-10 animate-bounce">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 z-10">
                    Oops! Terjadi Kesalahan
                </h3>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed z-10">
                    {message ||
                        "Gagal memproses permintaan. Silakan coba lagi."}
                </p>

                {/* Tombol Tutup */}
                <button
                    onClick={onClose}
                    className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 z-10"
                >
                    Mengerti
                </button>
            </div>
        </div>
    );
}
