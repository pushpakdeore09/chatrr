import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HiLockClosed, HiOutlineMail } from "react-icons/hi";
import toast from "react-hot-toast";
import { login } from "@/api/auth/Authapi";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { Eye, EyeOff } from "lucide-react";

const Loginpage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await login({ email, password });

      if (response) {
        const userData = response.data.user;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(setUser(userData));
        toast.success("Login Success!");
        navigate("/chats");
      }
    } catch (error: any) {
      toast.error(error.response.data);
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
            Welcome Back!
          </h2>

          <form
            onClick={(e) => {
              e.preventDefault();
            }}
          >
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
                  tabIndex={-1}
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleLogin}
              type="submit"
            >
              Login
            </Button>
          </form>
          <div className="flex justify-end mb-4 text-sm mt-2">
            <a
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </a>
          </div>

          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
