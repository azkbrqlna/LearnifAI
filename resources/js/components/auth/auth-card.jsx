import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "@inertiajs/react";

export default function AuthCard({ title, subtitle, children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
            <div className="absolute top-6 left-6">
                <Link href="/">
                    <Button>
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                </Link>
            </div>
            <Card className="w-full max-w-md border-3 bg-secondary-background">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-heading font-extrabold">
                        {title}
                    </CardTitle>
                    <p className="text-center text-sm mt-2 text-foreground">
                        {subtitle}
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">{children}</CardContent>
            </Card>
        </div>
    );
}
