"use client";
import { User } from "next-auth";
import React, { FC, useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
interface chatInputPartner {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<chatInputPartner> = ({ chatPartner, chatId }) => {
  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const sendMessage = async () => {
    if (input === "") {
      toast({
        title: "Empty",
        description: "message can't be empty",
      });
    }
    setLoading(true);
    try {
      if (input !== "") {
        await axios.post("/api/message/send", { text: input, chatId });
        setInput("");
        textAreaRef.current?.focus();
      }
    } catch (error) {
      if (error) {
        toast({
          title: "Somthing Went Wrong",
          description: "error while sending messages",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextAreaAutosize
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className=" absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2 ">
          <Button onClick={sendMessage} type="submit">
            {loading ? (
              <div>
                <Loader2 className="animate-spin h-full w-full" />
              </div>
            ) : (
              "post"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
