import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { API_URL } from "../../config";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

const sendMessage = async () => {
  if (input.trim() === "") return;

  const userMessage = {
    sender: "user",
    text: input,
  };

  setMessages((currentMessages) => [
    ...currentMessages,
    userMessage,
  ]);

  const messageToSend = input;

  setInput("");

  try {
    const response = await fetch(
      `${API_URL}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          latitude: userLocation?.latitude,
  longitude: userLocation?.longitude,
        }),
      }
    );

    const data = await response.json();

    const botMessage = {
      sender: "bot",
      text: data.reply,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      botMessage,
    ]);
  } catch (error) {
    console.error("Chat error:", error);
  }
};

const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      console.log("Unable to get location.");
    }
  );
};










  return (
    <div className="fixed z-5000 bottom-6 right-6 z-50">

      {!isOpen && (
        <button
          type="button"
            onClick={() => {
  setIsOpen(true);
  getUserLocation();
}}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition hover:bg-sky-700"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-sky-600 px-5 py-4 text-white">
            <div>
              <h2 className="font-semibold">CivicSetu Assistant</h2>
              <p className="text-xs text-sky-100">
                How can we help?
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-sky-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
         <div className="h-[350px] overflow-y-auto p-4">
  <p className="mb-4 text-sm text-gray-500">
    👋 Hello! How can I help you today?
  </p>

  <div className="space-y-3">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${
          message.sender === "user"
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
            message.sender === "user"
              ? "bg-sky-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.text}
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Input */}
          <div className="flex gap-2 border-t p-3">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onKeyDown={(event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
}}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <button
  type="button"
  onClick={sendMessage}
  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white hover:bg-sky-700"
>
  <Send size={18} />
</button>
          </div>

        </div>
      )}

    </div>
  );
};

export default ChatBox;