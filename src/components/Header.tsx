import React from 'react';
import { Heading, Section, Flex, Box } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <Section size="1" pt="1">
            <Flex align="center" justify={"between"} gap="3">
                <Box>
                    <Link href="/">
                        <Image
                            src="/looper-logo.jpg"
                            alt="Logo"
                            width={120}
                            height={40}
                        />
                    </Link>
                    <Box className="sr-only">
                        <Heading as="h1" size="4">Looper</Heading>
                    </Box>
                </Box>
                <Flex gap={"4"}>
                    <Link className='underline underline-offset-4 decoration-slate-300' href="/about">About</Link>
                    <Link className='underline underline-offset-4 decoration-slate-300' href="/docs">Docs</Link>
                </Flex>
            </Flex>
        </Section>
    )
}

export default Header;