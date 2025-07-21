import { register } from "@/api/auth/Authapi";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiLockClosed, HiOutlineMail, HiUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Signuppage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await register({ firstName, lastName, email, password });
      if (response) {
        toast.success("Registration Successful!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occured");
    }
  };

  return (
    <>
      <div
        className={`flex justify-center items-center min-h-screen bg-gradient-to-br 
          ${
            theme === "light"
              ? "from-blue-200 to-blue-500"
              : "from-black to-gray-800"
          }
        `}
      >
        <div
          className={`w-full max-w-md p-8 rounded-3xl shadow-2xl 
          ${
            theme === "light"
              ? "bg-white text-gray-800"
              : "bg-gray-800 text-white"
          }`}
        >
          <h2 className="text-3xl font-semibold text-center mb-6">
            Welcome to Chatrr!
          </h2>

          <form
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="mb-6">
              <label htmlFor="first-name" className="block text-sm font-medium">
                First Name
              </label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  id="first-name"
                  placeholder="Enter your first name"
                  className="p-3 pl-10 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <HiUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="last-name" className="block text-sm font-medium">
                Last Name
              </label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  id="last-name"
                  placeholder="Enter your last name"
                  className="p-3 pl-10 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <HiUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <div className="relative mt-2">
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="p-3 pl-10 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <HiOutlineMail className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="p-3 pl-10 border rounded-xl w-full focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <HiLockClosed className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSignup}
              type="submit"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signuppage;
