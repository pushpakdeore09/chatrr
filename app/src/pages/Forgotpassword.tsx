import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ForgotPassword = () => {
  const theme = useTheme();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassoword, setNewPassword] = useState<string>("");

  const handleSubmitEmail = async () => {
    console.log("email", email);
    setStep("otp");
  };

  const handleSubmitOtp = async () => {
    console.log("otp", otp);
    setStep("password");
  };

  const handleSubmitPassword = async () => {
    console.log(newPassoword);
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
              className="w-full cursor-pointer"
              disabled={!email}
              onClick={handleSubmitEmail}
            >
              Send OTP
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
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full max-w-sm cursor-pointer"
              onClick={handleSubmitOtp}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
