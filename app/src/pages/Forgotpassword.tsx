import { sendOTP, updatePassword, verifyOTP } from "@/api/auth/Authapi";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitEmail = async () => {
    setLoading(true);
    try {
      const response = await sendOTP(email);
      if (response.data) {
        toast.success(response.data.message);
      }
      setStep("otp");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    setLoading(true);
    const data = {
      email,
      otp,
    };
    try {
      const response = await verifyOTP(data);
      if (response.data.message) {
        toast.success(response.data.message);
      }
      setStep("password");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async () => {
    try {
      const response = await updatePassword({email, newPassword});
      if(response.data){
        toast.success(response.data.message);
        navigate('/login')
      }
    } catch (error) {
      console.log(error);
      
    }
  };
  return (
    <div
      className={`flex justify-center items-center min-h-screen bg-gradient-to-br 
          ${
            theme.theme === "light"
              ? "from-blue-200 to-blue-500"
              : "from-black to-gray-800"
          }
        `}
    >
      <div className="bg-white dark:bg-gray-900 rounded-md p-8 shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white select-none">
          Forgot Password
        </h2>

        {step === "email" && (
          <div className="space-y-4">
            <h4 className="text-center text-gray-500 dark:text-white select-none">
              Enter the email address where you'd like to receive the OTP.
            </h4>
            <div>
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                className="mt-2"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
              />
            </div>
            <Button
              className="w-full cursor-pointer bg-blue-500 select-none"
              disabled={!email}
              onClick={handleSubmitEmail}
            >
              {loading ? (
                <Loader2 className="h-7 w-7 animate-spin text-white" />
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm flex flex-col items-center">
              <Label
                htmlFor="otp"
                className="text-gray-700 dark:text-gray-300 mb-2"
              >
                Enter the 6-digit OTP
              </Label>

              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-12 text-lg sm:w-14 sm:h-14 sm:text-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full max-w-sm cursor-pointer bg-blue-500 select-none"
              onClick={handleSubmitOtp}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-4">
            <h4 className="text-center text-gray-500 dark:text-white select-none">
              Enter your new password
            </h4>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                className="mt-2"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
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
            </div>
            <Button
              className="w-full cursor-pointer bg-blue-500 select-none"
              onClick={handleSubmitPassword}
              disabled={newPassword.length < 6 || loading}
            >
              {loading ? (
                <Loader2 className="h-7 w-7 animate-spin text-white" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
