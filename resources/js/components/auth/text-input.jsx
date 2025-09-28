import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TextInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
}) {
    return (
        <div>
            <Label htmlFor={id} className="block text-sm mb-2 font-medium">
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <p className="mt-2 text-sm text-red-800">{error}</p>}
        </div>
    );
}
