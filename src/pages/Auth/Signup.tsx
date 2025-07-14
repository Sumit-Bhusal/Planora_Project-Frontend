import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Users,
  UserCog,
  Heart,
  Music,
  Briefcase,
  Palette,
  Trophy,
  GraduationCap,
  Gamepad2,
  Camera,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { RegisterData } from "../../types/auth";

const Signup: React.FC = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [interests, setInterests] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const { loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();

  const availableInterests = [
    { name: "Technology", icon: Gamepad2 },
    { name: "Business", icon: Briefcase },
    { name: "Arts", icon: Palette },
    { name: "Sports", icon: Trophy },
    { name: "Music", icon: Music },
    { name: "Education", icon: GraduationCap },
    { name: "Health & Wellness", icon: Heart },
    { name: "Photography", icon: Camera },
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (role === "user" && interests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setIsLoading(true);

    try {
      const data: RegisterData = {
        email,
        password,
        firstName: firstname,
        lastName: lastname,
        roles: ["user", "organizer"],
        username,
      };
      await register(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      await loginWithGoogle(role);
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleNext = () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");

    // If organizer, skip interest selection and create account directly
    if (role === "organizer") {
      setIsLoading(true);
      register({
        email,
        password,
        firstName: firstname,
        lastName: lastname,
        roles: ["organizer"],
        username,
      })
        .then(() => navigate("/dashboard"))
        .catch(() => setError("Failed to create account. Please try again."))
        .finally(() => setIsLoading(false));
    } else {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join Planora and start creating amazing events
          </p>
        </div>

        <Card className="p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {step === 1 ? (
            <>
              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                      role === "user"
                        ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Attend Events</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Discover and join events
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                      role === "organizer"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <UserCog className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Create Events</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Organize and manage events
                    </p>
                  </button>
                </div>
              </div>

              {/* Google Sign-Up Button */}
              <div className="mb-6">
                <Button
                  type="button"
                  onClick={handleGoogleSignUp}
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  loading={isGoogleLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="First name"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  icon={User}
                  required
                  placeholder="Enter your first name"
                />
                <Input
                  label="Last name"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  icon={User}
                  required
                  placeholder="Enter your last name"
                />

                <Input
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={User}
                  required
                  placeholder="Enter your username"
                />

                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                  placeholder="you@example.com"
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Input
                  label="Confirm password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Lock}
                  required
                  placeholder="Confirm your password"
                />

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  className="w-full"
                  loading={isLoading}
                  disabled={
                    !firstname ||
                    !lastname ||
                    !email ||
                    !password ||
                    !confirmPassword
                  }
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Interest Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What interests you?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select your interests to get personalized event
                  recommendations
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {availableInterests.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleInterestToggle(name)}
                      className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
                        interests.includes(name)
                          ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() =>
                    handleSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent)
                  }
                  className="flex-1"
                  loading={isLoading}
                  disabled={interests.length === 0}
                >
                  Create Account
                </Button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
