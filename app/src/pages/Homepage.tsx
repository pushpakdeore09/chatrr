import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
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
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/1600x900/?chat,technology')",
          }}
        ></div>

        <div className="relative z-10 max-w-lg w-full p-8 rounded-xl bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-600 mb-4 animate__animated animate__fadeIn">
            Welcome to Chatrr
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 animate__animated animate__fadeIn animate__delay-1s">
            Connect instantly with your friends, colleagues, or community.
          </p>

          <div className="space-y-4">
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full py-3 bg-blue-600 text-white rounded-full text-lg transition-transform transform hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
              >
                Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                size="lg"
                variant="default"
                className="w-full py-3 bg-green-600 text-white rounded-full text-lg transition-transform transform hover:scale-105 hover:bg-green-700 hover:shadow-lg"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white dark:text-gray-400 text-sm">
          <p>Made with ❤️ by YourName</p>
        </footer>
      </div>
    </>
  );
};

export default Homepage;
