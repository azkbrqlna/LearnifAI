import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import NavbarLayout from "@/components/layouts/navbar";

export default function LandingPage() {
    return (
        <div className="min-h-screen relative">
            <NavbarLayout />

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center px-6  py-16">
                <Card className="max-w-3xl w-full border-3 bg-secondary-background p-8">
                    <CardHeader>
                        <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-tight">
                            Belajar Cepat dengan <br />
                            <span className="text-main">LearnifAI</span>
                        </h1>
                    </CardHeader>

                    <CardContent>
                        <p className="mt-4 text-lg md:text-xl font-medium">
                            Platform AI yang secara otomatis membuat kursus,
                            modul, materi, dan quiz sesuai dengan apa yang ingin
                            kamu pelajari.
                        </p>

                        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
                            <Button>
                                <Link href="/generate">Mulai Belajar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
