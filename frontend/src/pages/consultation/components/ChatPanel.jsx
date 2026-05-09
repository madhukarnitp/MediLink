import { formatMessageTime, isOwnMessage } from "./consultationUtils";
import { useState } from "react";

const cx = (...items) => items.filter(Boolean).join(" ");

export default function ChatPanel({
  bottomRef,
  disabled,
  disabledReason,
  input,
  initials,
  messages,
  onInputChange,
  onSend,
  peerOnline,
  peerName,
  peerTyping,
  sending,
  socketReady,
  user,
}) {
  const [reactingTo, setReactingTo] = useState(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !disabled) onSend();
  };

  const handleReaction = (messageId, emoji) => {
    // In a real app, this would send the reaction to the server
    console.log(`Reacting to message ${messageId} with ${emoji}`);
    setReactingTo(null);
  };

  return (
    <div className="flex min-h-[520px] flex-col overflow-hidden rounded-med border border-med-border bg-med-card">
      <ChatHeader
        initials={initials}
        disabled={disabled}
        peerName={peerName}
        peerOnline={peerOnline}
        peerTyping={peerTyping}
        socketReady={socketReady}
      />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && <EmptyChat />}

        {messages.map((message, index) => (
          <MessageBubble
            key={message._id || `${message.createdAt}-${index}`}
            message={message}
            user={user}
            onReaction={handleReaction}
            reactingTo={reactingTo}
            setReactingTo={setReactingTo}
          />
        ))}

        {peerTyping && (
          <div className="flex max-w-[75%] flex-col gap-1 self-start">
            <div className="max-w-[280px] rounded-[18px] rounded-bl-md bg-med-card2 px-4 py-3 text-sm leading-relaxed text-med-text">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-med-border p-3.5">
        <input
          className="min-w-0 flex-1 rounded-[20px] border-2 border-med-border bg-med-card2 px-4 py-2.5 text-sm text-med-text transition focus:border-med-primary focus:shadow-[0_0_0_3px_rgba(16,185,129,0.10)] disabled:cursor-not-allowed disabled:opacity-70"
          placeholder={
            disabled
              ? disabledReason
              : socketReady
                ? "Type a message..."
                : "Connecting..."
          }
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          disabled={sending || disabled}
          autoComplete="off"
        />
        <button
          className="min-h-[38px] rounded-[20px] bg-med-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          onClick={onSend}
          disabled={sending || disabled || !input.trim()}
          title="Send"
          type="button"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

function ChatHeader({
  disabled,
  initials,
  peerName,
  peerOnline,
  peerTyping,
  socketReady,
}) {
  const isPeerOnline = Boolean(peerOnline && !disabled);
  const peerStatusText = peerTyping
    ? "typing..."
    : isPeerOnline
      ? "Online"
      : "Offline";

  return (
    <div className="flex items-center gap-2.5 border-b border-med-border p-3.5">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-med border border-med-border bg-med-card2 text-sm font-bold">
        {initials}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-med-text">{peerName}</div>
        <div
          className={cx(
            "flex items-center gap-1 text-[11px]",
            peerTyping || isPeerOnline ? "text-med-primary" : "text-med-muted",
          )}
        >
          <span
            className={cx(
              "h-1.5 w-1.5 rounded-full",
              peerTyping || isPeerOnline ? "bg-med-primary" : "bg-med-muted",
            )}
          />
          {peerStatusText}
        </div>
      </div>
      <span
        className={cx(
          "rounded-full px-2 py-1 text-[10px] font-bold",
          socketReady ? "bg-[var(--primary-dim)] text-med-primary" : "bg-med-card2 text-med-muted",
        )}
      >
        {socketReady && !disabled
          ? "LIVE"
          : socketReady
            ? "PENDING"
            : "connecting..."}
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-med-muted [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-med-muted [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-med-muted" />
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="m-auto text-center text-med-muted">
      <div className="mb-2 text-4xl">💬</div>
      <div className="font-semibold">No messages yet</div>
      <div className="mt-1.5 text-[11px] text-slate-400">
        Start the conversation when the consultation is active.
      </div>
    </div>
  );
}

function MessageBubble({ message, user, onReaction, reactingTo, setReactingTo }) {
  const isMe = isOwnMessage(message, user);
  const isPending = message._id?.startsWith("tmp_");

  const handleReactionClick = (emoji) => {
    onReaction(message._id, emoji);
  };

  return (
    <div
      className={cx(
        "flex max-w-[75%] flex-col gap-1 max-sm:max-w-[88%]",
        isMe ? "self-end" : "self-start",
      )}
    >
      <div className="group relative flex items-end gap-2">
        <div
          className={cx(
            "max-w-[280px] break-words rounded-[18px] px-4 py-3 text-sm leading-relaxed",
            isMe
              ? "rounded-br-md bg-med-primary text-white shadow-sm"
              : "rounded-bl-md bg-med-card2 text-med-text",
          )}
        >
          {message.text}
          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 border-t border-white/20 pt-2">
              {message.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs"
                >
                  {reaction.emoji} {reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isMe && (
          <button
            className="rounded-full p-1 text-sm opacity-0 transition hover:bg-black/10 group-hover:opacity-100"
            onClick={() => setReactingTo(reactingTo === message._id ? null : message._id)}
            title="React"
            type="button"
          >
            😊
          </button>
        )}
      </div>
      {reactingTo === message._id && (
        <div className="mt-2 flex gap-1 rounded-med border border-med-border bg-med-card p-2 shadow-lg">
          {["👍", "❤️", "😂", "😮", "😢", "😡"].map((emoji) => (
            <button
              key={emoji}
              className="rounded-md p-1 text-xl transition hover:bg-med-card2"
              onClick={() => handleReactionClick(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      <div className={cx("text-[10px] text-med-muted", isMe && "text-right")}>
        {formatMessageTime(message.createdAt)}
        {isMe && (
          <span className="ml-1">
            {isPending ? "○" : "✓"}
          </span>
        )}
      </div>
    </div>
  );
}
