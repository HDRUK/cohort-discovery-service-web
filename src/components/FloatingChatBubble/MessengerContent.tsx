"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField } from "@mui/material";
import type { Thread, Message } from "nextjs-messenger";
import getThreadById from "@/actions/messenger/getThreadById";
import sendMessageAction from "@/actions/messenger/sendMessage";
import markMessageReadAction from "@/actions/messenger/markMessageRead";
import getThreads from "@/actions/messenger/getThreads";
import { useDaphneStore } from "@/store/useDaphneStore";

interface MessengerContentProps {
  onClose?: () => void;
  token: string;
  initialThreads?: Thread[];
}

export default function MessengerContent({ onClose, token, initialThreads = [] }: MessengerContentProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [composer, setComposer] = useState("");

  const { userData: { user }, } = useDaphneStore();

  useEffect(() => {
    if (threads.length <= 0) {
        getThreads().then(setThreads).catch((e) => {
            console.error(e);
        });
    }
  }, []);

    const handleSelectThread = useCallback(
        async (thread: Thread) => {
            setSelectedThread(thread);
            setLoadingMessages(true);

            try {
            const t = await getThreadById(thread.id);
            setMessages(t.messages || []);

            // Mark unread messages as read (fire-and-forget)
            t.messages?.forEach((m) => {
                if (m.is_read === 0) {
                markMessageReadAction(m.id).catch((e) => console.error(e));
                }
            });
            } catch (e) {
                console.error("Failed to load thread", e);
                setMessages([]);
            } finally {
                setLoadingMessages(false);
            }
        },
        [
            setSelectedThread,
            setLoadingMessages,
            setMessages,
            getThreadById,
            markMessageReadAction,
        ]
        );


    const handleSend = useCallback(async () => {
    if (!selectedThread) return;

    const payload = {
        sender_id: user.id,
        receiver_id: 2,
        thread_id: selectedThread.id,
        subject: selectedThread.subject,
        body: composer,
    };

    try {
        const msg = await sendMessageAction(payload);
        setMessages((s) => [...s, msg]);
        setComposer("");
    } catch (e) {
        console.error("Failed to send message", e);
    }
    }, [selectedThread, composer, sendMessageAction, setMessages, setComposer]);


  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100%", width: "100%", maxWidth: "900px" }}>
      <Box sx={{ flex: "0 0 220px", maxWidth: 260, borderRight: 1, borderColor: "divider", overflow: "auto", p: 1 }}>
        {threads.length === 0 ? (
          <Box sx={{ p: 2, color: "text.secondary" }}>No threads found.</Box>
        ) : (
          threads.map((t) => {
            const active = selectedThread?.id === t.id;
            return (
              <Box
                key={t.id}
                onClick={() => handleSelectThread(t)}
                sx={{
                  background: active ? "action.hover" : "transparent",
                  padding: 1,
                  mb: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <div style={{ fontWeight: 600 }}>{t.subject ?? t.latest_message?.body?.slice(0, 40)}</div>
                <div style={{ fontSize: 12 }}>{t.latest_message?.body}</div>
              </Box>
            );
          })
        )}
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, minWidth: 0, minHeight: 0 }}>
        {selectedThread ? (
          <>
            <Box sx={{ mb: 2, fontWeight: 700, flexShrink: 0 }}>{selectedThread.subject}</Box>
            <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
              {loadingMessages ? (
                <Box>Loading messages...</Box>
              ) : messages.length === 0 ? (
                <Box>No messages.</Box>
              ) : (
                messages.map((m) => {
                  const isCurrentUser = m.sender_id === user.id;
                  return (
                    <Box
                      key={m.id}
                      sx={{
                        mb: 1,
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        backgroundColor: isCurrentUser ? "#beed9a" : "#83c1de",
                        marginLeft: isCurrentUser ? 2 : 0,
                        marginRight: isCurrentUser ? 0 : 2,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "text.primary", marginBottom: 4 }}>
                        {isCurrentUser ? "You" : `From: ${m.receiver.name}`}
                      </div>
                      <div style={{ marginTop: 6, fontWeight: 500 }}>{m.body}</div>
                      <div style={{ fontSize: 11, color: "text.secondary", marginTop: 6 }}>{new Date(m.created_at).toLocaleString()}</div>
                    </Box>
                  );
                })
              )}
            </Box>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); void handleSend(); }} sx={{ display: "flex", gap: 1, flexShrink: 0, borderTop: 1, borderColor: "divider", pt: 1, backgroundColor: "background.paper" }}>
              <TextField fullWidth size="small" value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="Write a message" />
              <Button type="submit" variant="contained">Send</Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2 }}>Select a thread</Box>
        )}
      </Box>
    </Box>
  );
}
