import { usePage } from "@inertiajs/react";
import ThemeMode from "../navbar/change-mode";
import { Button } from "../ui/button";
import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User, Settings, LogOut } from "lucide-react";

export default function NavbarLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        document.getElementById("logout-form").submit();
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div>
            <nav className="w-full flex items-center justify-between px-6 py-4 bg-secondary-background border-border border-b-3">
                <div className="text-2xl font-bold tracking-tight">
                    LearnifAI
                </div>

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Button className="bg-secondary dark:text-white">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button>
                                <Link href="/register">Sign Up</Link>
                            </Button>
                            <ThemeMode />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/generate"
                                className="font-bold transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Generate
                            </Link>
                            <Link
                                href="/library"
                                className="font-bold transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Library
                            </Link>
                            <ThemeMode />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="cursor-pointer flex items-center w-full"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/settings"
                                            className="cursor-pointer flex items-center w-full"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 cursor-pointer flex items-center"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Hidden logout form */}
                            <form
                                id="logout-form"
                                method="POST"
                                action="/logout"
                                className="hidden"
                            />
                        </>
                    )}
                </div>
            </nav>

            <main className="flex-1 px-6 py-6">{children}</main>
        </div>
    );
}
