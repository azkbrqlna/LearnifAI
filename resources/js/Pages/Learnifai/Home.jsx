import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { post } = useForm();

    const handleLogout = () => {
        post("/logout");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-3xl font-light mb-6">
                Selamat Datang di LearnifAI 🎓
            </h1>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}
