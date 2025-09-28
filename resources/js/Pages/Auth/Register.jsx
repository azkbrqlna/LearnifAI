import AuthCard from "@/components/auth/auth-card";
import FormButton from "@/components/auth/form-button";
import TextInput from "@/components/auth/text-input";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

import { useState } from "react";

export default function RegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        let validationErrors = {};
        if (!data.name.trim()) validationErrors.name = "Nama wajib diisi.";
        if (!data.email.trim()) validationErrors.email = "Email wajib diisi.";
        if (!data.password) validationErrors.password = "Password wajib diisi.";
        else if (data.password.length < 8)
            validationErrors.password = "Password minimal 8 karakter.";
        if (!data.password_confirmation)
            validationErrors.password_confirmation =
                "Konfirmasi password wajib diisi.";
        else if (data.password !== data.password_confirmation)
            validationErrors.password_confirmation = "Password tidak sama.";

        setLocalErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            post("/register");
        }
    };

    return (
        <AuthCard
            title="Daftar Akun Baru"
            subtitle={
                <>
                    Bergabung dengan{" "}
                    <span className="font-bold">LearnifAI</span> sekarang
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    id="name"
                    label="Nama Lengkap"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    error={errors.name || localErrors.name}
                />

                <TextInput
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="nama@email.com"
                    error={errors.email || localErrors.email}
                />

                <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Minimal 8 karakter"
                    error={errors.password || localErrors.password}
                />

                <TextInput
                    id="password_confirmation"
                    label="Konfirmasi Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    placeholder="Ulangi password Anda"
                    error={
                        errors.password_confirmation ||
                        localErrors.password_confirmation
                    }
                />

                <FormButton processing={processing}>Daftar</FormButton>
            </form>

            <p className="text-center text-sm mt-4 font-light">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold hover:underline">
                    Masuk sekarang
                </Link>
            </p>
        </AuthCard>
    );
}
