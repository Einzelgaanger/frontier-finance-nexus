import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { decodeString } from "@/utils/encodingSystem";
import { toast } from "sonner";

const EncodedAuthForm = () => {
  const [encodedEmail, setEncodedEmail] = useState("");
  const [encodedPassword, setEncodedPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Decode email and password
      const decodedEmail = decodeString(encodedEmail);
      const decodedPassword = decodeString(encodedPassword);

      // Validate decoded values
      if (!decodedEmail || !decodedPassword) {
        setError("Invalid encoded email or password format");
        setLoading(false);
        return;
      }

      // Sign in with decoded credentials
      const { error: signInError } = await signIn(decodedEmail, decodedPassword);

      if (signInError) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Data Entry Login</CardTitle>
          <CardDescription>
            Enter your encoded credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="encodedEmail">Encoded Email</Label>
              <Input
                id="encodedEmail"
                type="text"
                placeholder="10-11-12-..."
                value={encodedEmail}
                onChange={(e) => setEncodedEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="encodedPassword">Encoded Password</Label>
              <Input
                id="encodedPassword"
                type="text"
                placeholder="25-10-28-..."
                value={encodedPassword}
                onChange={(e) => setEncodedPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-sm text-muted-foreground text-center mt-4">
              <p>Default encoded password:</p>
              <code className="text-xs bg-muted p-1 rounded break-all">
                603857-847263-485106-485106-526743-954138-918372-238475-378152-641827-293765
              </code>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncodedAuthForm;
