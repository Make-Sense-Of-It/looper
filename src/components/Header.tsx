import React from "react";
import { Heading, Flex, Box } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useConversation } from "@/src/providers/ConversationProvider";
import { useFileProcessing } from "@/src/providers/FileProcessingProvider";
import ConversationHeaderControls from "./ui/HeaderConversationControls";

const Header: React.FC = () => {
  const { setCurrentGroup } = useConversation();
  const { clearProcessingState } = useFileProcessing();
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clearProcessingState();
    setCurrentGroup(null);
    router.push("/");
  };

  return (
    <header className="fixed w-full z-10 h-16 bg-bronze-1 p-4 border-b border-bronze-3">
      <Flex align="center" justify={"between"} gap="3">
        <Box>
          <Link href="/" onClick={handleHomeClick}>
            <Image src="/looper-logo.png" priority alt="Looper logo" width={120} height={40} style={{ height: 'auto', width: 'auto' }} />
          </Link>
          <Box className="sr-only">
            <Heading as="h1" size="4">
              Looper
            </Heading>
          </Box>
        </Box>
        <ConversationHeaderControls />
        <Flex gap={"4"}>
          <Link
            className="underline underline-offset-4 decoration-bronze-7"
            href="/history"
          >
            History
          </Link>
          <Link
            className="underline underline-offset-4 decoration-bronze-7"
            href="/about"
          >
            About
          </Link>
          <Link
            className="underline underline-offset-4 decoration-bronze-7"
            href="/docs"
          >
            Docs
          </Link>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
