import { useEffect, useState } from "react";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import { useTheme } from "@/components/theme-provider";
import LeftPanel from "@/components/common/LeftPanel";
import RightPanel from "@/components/common/RightPanel";
import NavBar from "@/components/common/NavBar";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";


const Chatpage = () => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [sizes, setSizes] = useState([450, "auto"]);

  const minWidth = 200;
  const maxWidth = 500;

  const handleResize = (newSizes: number[]) => {
    const newLeftPanelSize = Math.max(
      minWidth,
      Math.min(newSizes[0], maxWidth)
    );

    setSizes([newLeftPanelSize, newSizes[1]]);
  };
  const socket = io('http://localhost:3000');
  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connection", () => {
      setSocketConnected(true);
    });
    
  });

  return (
    <div
      className={`min-h-screen ${
        theme.theme === "light" ? "bg-blue-100" : "bg-gray-900"
      } text-${theme.theme === "light" ? "gray-800" : "white"}`}
    >
      <NavBar />
      <div className="h-[calc(100vh-88px)]">
        <SplitPane
          split="vertical"
          sizes={sizes}
          onChange={handleResize}
          sashRender={() => (
            <div className="bg-blue-500 w-1 hover:w-2 transition-all cursor-col-resize" />
          )}
        >
          <LeftPanel
            setSelectedChatId={setSelectedChatId}
            selectedChatId={selectedChatId}
          />
          {selectedChatId ? (
            <RightPanel
              socket={socket}
              socketConnected={socketConnected}
              setSelectedChatId={setSelectedChatId}
              selectedChatId={selectedChatId}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-500 dark:text-gray-400 select-none">
              Select a chat to start messaging
            </div>
          )}
        </SplitPane>
      </div>
    </div>
  );
};

export default Chatpage;
