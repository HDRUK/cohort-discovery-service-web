"use client";

import { useState } from "react";
import { Fab, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MessengerContent from "./MessengerContent";

interface FloatingChatBubbleProps {
  token: string;
}

export default function FloatingChatBubble({ token }: FloatingChatBubbleProps) {
  const [messengerOpen, setMessengerOpen] = useState(false);

  const handleChatClick = () => {
    if (messengerOpen) {
        setMessengerOpen(false);
        return;
    }

    setMessengerOpen(true);
  };

  const handleCloseMessenger = () => {
    setMessengerOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleChatClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </Fab>

      {messengerOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            zIndex: 1001,
            width: { xs: "calc(100% - 32px)", sm: "min(900px, 90vw)" },
            height: "80vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 3,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <MessengerContent token={token} onClose={handleCloseMessenger} />
        </Box>
      )}
    </>
  );
}
