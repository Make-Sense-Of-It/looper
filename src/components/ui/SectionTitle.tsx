import React from 'react';
import { Heading } from '@radix-ui/themes';

interface SectionTitleProps {
    children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
    return (
        <Heading as="h3" size="1" mb={"-1"}>
            {children}
        </Heading>
    );
};

export default SectionTitle;