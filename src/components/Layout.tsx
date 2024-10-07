// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Container>
            <Flex direction="column" height="100vh" p="4" justify={"between"}>
                <Box>
                    <Header />
                    <Flex direction="column" width={"full"} className="bg-yellow-200">
                        {children}
                    </Flex>
                </Box>
                <Footer />
            </Flex>
        </Container>
    );
};

export default Layout;