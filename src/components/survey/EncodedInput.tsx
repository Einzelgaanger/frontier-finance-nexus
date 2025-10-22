import { Input } from "@/components/ui/input";
import { decodeString } from "@/utils/encodingSystem";
import { useState, useEffect } from "react";

interface EncodedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (decoded: string) => void;
}

const EncodedInput = ({ value, onValueChange, ...props }: EncodedInputProps) => {
  const [encodedValue, setEncodedValue] = useState("");

  useEffect(() => {
    // If we have a value that's not encoded, clear the input
    if (value && !value.includes('-')) {
      setEncodedValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const encoded = e.target.value;
    setEncodedValue(encoded);
    
    // Decode and pass to parent
    const decoded = decodeString(encoded);
    onValueChange(decoded);
  };

  return (
    <Input
      {...props}
      value={encodedValue}
      onChange={handleChange}
      placeholder="Enter encoded value (e.g., 10-11-12-...)"
    />
  );
};

export default EncodedInput;
