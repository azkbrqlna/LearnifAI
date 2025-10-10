import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogIn, UserPlus } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function MobileDropdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Menu size={22} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={"mt-2 mr-2"}>
                <DropdownMenuItem asChild>
                    <Link href="/login">
                        <LogIn size={18} /> <span>Login</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/register">
                        <UserPlus size={18} /> <span>Register</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
