"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import FloatingChatBubble from "../FloatingChatBubble/FloatingChatBubble";

export default function InAppMessengerFeatureWrapper({ token }: { token: string }) {
    const { featureFlags: { flags } } = useDaphneStore();

    return (
        <>
            {(flags as Record<string, boolean>)?.["in-app-messenger"] && (
                <FloatingChatBubble token={token} />
            )}
        </>
    );
}
