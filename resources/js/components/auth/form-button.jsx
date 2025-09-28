import { Button } from "../ui/button";

export default function FormButton({ children, processing, ...props }) {
    return (
        <Button
            type="submit"
            disabled={processing}
            className="w-full px-6 py-3"
            {...props}
        >
            {processing ? "Memproses..." : children}
        </Button>
    );
}
