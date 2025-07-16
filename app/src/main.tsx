import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { ChatProvider } from "./context/Chatcontext.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ChatProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ChatProvider>
      <Toaster />
    </Provider>
  </StrictMode>
);
