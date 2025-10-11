import React from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function Loading({ open, title }) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="text-center">
                <AlertDialogTitle className="text-lg font-semibold">
                    {title}
                </AlertDialogTitle>
                <div className="flex justify-center mt-6">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
