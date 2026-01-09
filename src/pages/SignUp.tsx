import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, Chrome, Facebook, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signup, loginWithGoogle, loginWithFacebook } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await signup(name, email, password);
            toast({
                title: "Account created!",
                description: "Welcome to MediPro. Your account has been created successfully.",
            });
            navigate("/");
        } catch (err) {
            setError("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast({
                title: "Welcome!",
                description: "Your account has been created with Google.",
            });
            navigate("/");
        } catch (err) {
            setError("Google signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookSignup = async () => {
        setIsLoading(true);
        try {
            await loginWithFacebook();
            toast({
                title: "Welcome!",
                description: "Your account has been created with Facebook.",
            });
            navigate("/");
        } catch (err) {
            setError("Facebook signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                            Create Account
                        </h1>
                        <p className="text-muted-foreground">
                            Join MediPro for a better wellness experience
                        </p>
                    </div>

                    {/* Sign Up Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Social Sign Up Buttons */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={handleGoogleSignup}
                                disabled={isLoading}
                            >
                                <Chrome className="w-5 h-5 mr-2" />
                                Sign up with Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={handleFacebookSignup}
                                disabled={isLoading}
                            >
                                <Facebook className="w-5 h-5 mr-2" />
                                Sign up with Facebook
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-card text-muted-foreground">Or sign up with email</span>
                            </div>
                        </div>

                        {/* Email Sign Up Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary mt-1"
                                />
                                <span className="ml-2 text-sm text-foreground/80">
                                    I agree to the{" "}
                                    <a href="#" className="text-primary hover:underline">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-primary hover:underline">
                                        Privacy Policy
                                    </a>
                                </span>
                            </div>

                            <Button type="submit" className="w-full h-12" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>
                    </div>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-foreground/80">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SignUp;
