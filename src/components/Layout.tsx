// src/components/Layout.tsx
import React, { ReactNode } from "react";
import { Box, Flex } from "@radix-ui/themes";
// import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" height="100vh">
      <Box>
        <Header />
        {/* <Container> */}
          <Flex direction="column" width={"full"} className="">
            {children}
          </Flex>
        {/* </Container> */}
      </Box>
    </Flex>
  );
};

export default Layout;
