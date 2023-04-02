import { Inter } from "next/font/google";
import ChatGptLogo from "../../public/ChatGPT_logo.png";
import Image from "next/image";
import AxiosInstance from "@/helper/AxiosInstance";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [inputText, setInputText] = useState("");
  useEffect(() => {
    let localData = localStorage.getItem("chats") || "[]";
    setChats(JSON.parse(localData));
  }, []);
  const onSubmit = () => {
    if (!inputText) {
      return alert("Please enter a message");
    }
    const tempText = inputText;
    setInputText("");
    setLoading(true);
    let obj = {
      msg: tempText,
      fromBot: false,
    };
    setChats([...chats, obj]);

    let data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: tempText }],
    };
    AxiosInstance.post("/chat/completions", data)
      .then((res) => {
        const { data } = res;
        const msg = data.choices && data.choices[0].message.content;

        let obj = {
          msg,
          fromBot: true,
        };
        console.log(chats);
        setChats([
          ...chats,
          {
            msg: tempText,
            fromBot: false,
          },
          obj,
        ]);
        setInputText("");
        setLoading(false);
        localStorage.setItem(
          "chats",
          JSON.stringify([
            ...chats,
            {
              msg: tempText,
              fromBot: false,
            },
            obj,
          ])
        );
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto">
      <div className=" border rounded">
        <div>
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <Image
                className="object-cover w-10 h-10 rounded-full"
                src={ChatGptLogo}
                alt="Chat gpt Logo"
              />
              <span className="block ml-2 font-bold text-gray-600">
                ChatBot
              </span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
            </div>
            <div className="relative w-full p-6 overflow-y-auto min-h-[82vh]">
              <ul className="space-y-2">
                {chats.map((chat) => (
                  <li
                    key={chat.msg}
                    className={`flex ${
                      chat.fromBot ? "justify-start" : "justify-end"
                    } `}
                  >
                    <div className="relative w-auto px-4 py-2 text-gray-700 rounded shadow">
                      <span className="block">
                        <ReactMarkdown>{chat.msg}</ReactMarkdown>
                      </span>
                    </div>
                  </li>
                ))}
                {loading && (
                  <li className={`flex justify-start`}>
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                      <span className="flex gap-x-1 ">
                        <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce "></div>
                        <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce  delay-500"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-500  animate-bounce "></div>
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              <input
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    onSubmit();
                  }
                }}
                type="text"
                placeholder="Message"
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message"
                required
              />

              <button type="submit" onClick={onSubmit} disabled={loading}>
                <svg
                  className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
