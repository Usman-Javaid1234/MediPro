import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Chrome, Facebook, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login, loginWithGoogle, loginWithFacebook } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
            navigate("/");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast({
                title: "Welcome!",
                description: "You have successfully logged in with Google.",
            });
            navigate("/");
        } catch (err) {
            setError("Google login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithFacebook();
            toast({
                title: "Welcome!",
                description: "You have successfully logged in with Facebook.",
            });
            navigate("/");
        } catch (err) {
            setError("Facebook login failed. Please try again.");
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
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to continue to MediPro
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <Chrome className="w-5 h-5 mr-2" />
                                Continue with Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={handleFacebookLogin}
                                disabled={isLoading}
                            >
                                <Facebook className="w-5 h-5 mr-2" />
                                Continue with Facebook
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-card text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        {/* Email Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-foreground/80">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            <Button type="submit" className="w-full h-12" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center mt-6 text-foreground/80">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
