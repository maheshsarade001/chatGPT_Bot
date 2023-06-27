/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
import ChatGptLogo from "../../public/ChatGPT_logo.png";
import Image from "next/image";
import AxiosInstance from "@/helper/AxiosInstance";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Head from "next/head";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [theme, setTheme] = useState("light");
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    let localData = localStorage.getItem("chats") || "[]";
    setChats(JSON.parse(localData));
    setTheme(localStorage.getItem("theme") || "light");
    changeMode();
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

        setChats([
          ...chats,
          {
            msg: tempText,
            fromBot: false,
          },
          obj,
        ]);
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
  const onImageSearch = () => {
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
      prompt: tempText,
      n: 1,
      size: "512x512",
    };
    AxiosInstance.post("/images/generations", data)
      .then((res) => {
        const { data } = res;
        const msg = data.data[0].url;
        console.log(msg);
        let obj = {
          msg,
          fromBot: true,
          isImg: true,
        };

        setChats([
          ...chats,
          {
            msg: tempText,
            fromBot: false,
          },
          obj,
        ]);
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

  const changeMode = (theme) => {
    let body = document.querySelector("body");
    if (theme) {
      body.className = theme;
      setTheme(theme);
      localStorage.setItem("theme", theme);
    } else {
      let localTheme = localStorage.getItem("theme") || "light";
      body.className = localTheme;
    }
  };

  return (
    <>
      <Head>
        <title>Chatbot </title>
      </Head>
      <div className="dark:bg-slate-800 min-h-screen">
        <div className="container mx-auto">
          <div className=" border dark:border-slate-600 rounded">
            <div>
              <div className="w-full">
                <div className="relative flex items-center p-3 border-b border-gray-300 dark:border-slate-600 justify-between">
                  <div className="flex items-center">
                    <Image
                      className="object-cover w-10 h-10 rounded-full"
                      src={ChatGptLogo}
                      alt="Chat gpt Logo"
                    />
                    <span className="block ml-2 font-bold text-gray-600 dark:text-gray-50">
                      ChatBot
                    </span>
                    <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
                  </div>
                  {theme == "light" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-900 !cursor-pointer"
                      onClick={() => {
                        changeMode("dark");
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-50 !cursor-pointer"
                      onClick={() => {
                        changeMode("light");
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  )}
                </div>

                <div className="relative w-full p-6 overflow-y-auto min-h-[82vh] ">
                  <ul className="space-y-2">
                    {chats.map((chat) => (
                      <li
                        key={chat.msg}
                        className={`flex ${
                          chat.fromBot ? "justify-start" : "justify-end"
                        } `}
                      >
                        <div className="relative w-auto px-4 py-2 text-gray-700 rounded shadow dark:bg-slate-600">
                          {chat.isImg ? (
                            <img src={chat.msg} alt="" />
                          ) : (
                            <span className="block dark:text-gray-50">
                              <ReactMarkdown>{chat.msg}</ReactMarkdown>
                            </span>
                          )}
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
                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300 dark:border-slate-600">
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
                    className="block w-full py-2 pl-4 mx-3 bg-gray-100 dark:bg-slate-600 dark:text-gray-50 dark:focus:text-gray-50 rounded-full outline-none focus:text-gray-700"
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
                  <button onClick={onImageSearch}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500 ml-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
