// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Box, Container, Flex } from '@radix-ui/themes';
import Footer from './Footer';
import Header from './Header';

import { Error } from '@/src/components/ui/Error';
import { useFileAnalysis } from '../providers/FileAnalysisProvider';

const ErrorHandler = ({ children }: { children: React.ReactNode }) => {
    const { error } = useFileAnalysis();

    if (error) {
        return <Error message={error} />;
    }

    return <>{children}</>;
};

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ErrorHandler>
            <Container>
                <Flex direction="column" height="100vh" p="4" justify={"between"}>
                    <Box>
                        <Header />
                        <Flex direction="column" width={"full"} className="">
                            {children}
                        </Flex>
                    </Box>
                    <Footer />
                </Flex>
            </Container>
        </ErrorHandler>
    );
};

export default Layout;