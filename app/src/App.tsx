import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Chatpage from "./pages/Chatpage";
import Profilepage from "./pages/Profilepage";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
        <Router>
          <Routes>
            {/* Public homepage: if logged in redirect to chats */}
            <Route
              path="/"
              element={<Homepage />}
            />

            {/* Protected routes */}
            <Route
              path="/chats"
              element={user ? <Chatpage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile/:_id"
              element={
                user ? <Profilepage /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/login"
              element={user ? <Navigate to="/chats" replace /> : <Loginpage />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/chats" replace /> : <Signuppage />}
            />
          </Routes>
        </Router>
        
    </>
  );
}

export default App;
