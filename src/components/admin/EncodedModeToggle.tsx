import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isEncodedModeEnabled, setEncodedMode } from "@/utils/encodingSystem";
import { toast } from "sonner";

const EncodedModeToggle = () => {
  const [isEncoded, setIsEncoded] = useState(false);

  useEffect(() => {
    setIsEncoded(isEncodedModeEnabled());
  }, []);

  const handleToggle = (checked: boolean) => {
    setEncodedMode(checked);
    setIsEncoded(checked);
    
    toast.success(
      checked 
        ? "Encoded display mode enabled" 
        : "Normal display mode enabled"
    );
    
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Privacy Mode</CardTitle>
        <CardDescription>
          Toggle between encoded and normal data display for data entry privacy
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Label htmlFor="encoded-mode" className="text-base">
          {isEncoded ? "Encoded Display Active" : "Normal Display Active"}
        </Label>
        <Switch
          id="encoded-mode"
          checked={isEncoded}
          onCheckedChange={handleToggle}
        />
      </CardContent>
    </Card>
  );
};

export default EncodedModeToggle;
