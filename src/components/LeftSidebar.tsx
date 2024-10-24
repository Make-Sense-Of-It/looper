import React, { useEffect, useState, useRef } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Box, IconButton, Flex } from "@radix-ui/themes";
import { useLocalStorage } from "../providers/LocalStorageContext";
import Footer from "./Footer";

interface LeftSidebarProps {
  children: React.ReactNode;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ children }) => {
  const { getItem, setItem } = useLocalStorage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for header and footer
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Get initial saved state
    const savedState = getItem("sidebarExpanded");
    if (savedState !== null) {
      setIsExpanded(savedState === "true");
    }

    // Function to measure and set offsets
    const measureOffsets = () => {
      headerRef.current = document.querySelector("header");
      footerRef.current = document.querySelector("footer");

      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setTopOffset(headerHeight);
      }

      if (footerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const footerHeight = footerRef.current.offsetHeight;
        setBottomOffset(0);
      }
    };

    // Measure initially and on resize
    measureOffsets();
    window.addEventListener("resize", measureOffsets);

    return () => {
      window.removeEventListener("resize", measureOffsets);
    };
  }, [getItem]);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    const newState = !isExpanded;
    setIsExpanded(newState);
    setItem("sidebarExpanded", String(newState));

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with transition duration
  };

  return (
    <>
      <Box
        pt="4"
        position="fixed"
        left="0"
        className="bg-bronze-2 border-r border-bronze-4"
        style={{
          top: topOffset,
          bottom: bottomOffset,
          width: isExpanded ? "16rem" : "3rem",
          transition: "width 300ms ease-in-out",
          zIndex: 5,
        }}
      >
        <Flex
          direction="column"
          justify={"between"}
          height="100%"
          p={isExpanded ? "4" : "2"}
        >
          <Box
            style={{
              opacity: isTransitioning ? 0 : 1,
              transition: "opacity 150ms ease-in-out",
            }}
          >
            {isExpanded && children}
          </Box>

          <Box
            position="absolute"
            right="20px"
            top="20px"
            style={{
              transform: "translate(50%, -50%)",
              zIndex: 15,
            }}
          >
            <IconButton
              size="1"
              variant="ghost"
              onClick={toggleSidebar}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          <Box
            className={` ${
              isExpanded ? "w-full opacity-100" : "w-1 opacity-0"
            } overflow-clip transition-all`}
          >
            <Footer />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default LeftSidebar;
