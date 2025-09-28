import AuthCard from "@/components/auth/auth-card";
import FormButton from "@/components/auth/form-button";
import TextInput from "@/components/auth/text-input";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function LoginForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const [localErrors, setLocalErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        let validationErrors = {};
        if (!data.email.trim()) validationErrors.email = "Email wajib diisi.";
        if (!data.password) validationErrors.password = "Password wajib diisi.";

        setLocalErrors(validationErrors);

        // Submit ke server jika tidak ada error
        if (Object.keys(validationErrors).length === 0) {
            post("/login");
        }
    };

    return (
        <AuthCard
            title="Selamat Datang"
            subtitle={
                <>
                    Masuk ke akun <span className="font-bold">LearnifAI</span>{" "}
                    Anda
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    error={errors.password || localErrors.password}
                />

                <FormButton processing={processing}>Masuk</FormButton>
            </form>

            <p className="text-center text-sm mt-4 font-light">
                Belum punya akun?{" "}
                <Link href="/register" className="font-bold hover:underline">
                    Daftar sekarang
                </Link>
            </p>
        </AuthCard>
    );
}
