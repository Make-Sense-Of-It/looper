import React from 'react';
import { Heading, Section, Flex, Box } from '@radix-ui/themes';
import Image from 'next/image';

const Header: React.FC = () => {
    return (
        <Section size="1" pt="1">
            <Flex align="center" gap="3">
                <Image
                    src="/looper-logo.jpg"
                    alt="Logo"
                    width={120}
                    height={40}
                />
                <Box className="sr-only">
                    <Heading as="h1" size="4">Looper</Heading>
                </Box>
            </Flex>
        </Section>
    )
}

export default Header;