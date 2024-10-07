import React from 'react';
import { Heading, Section, Text } from '@radix-ui/themes';

const Header: React.FC = () => {
    return (
        <Section size="1" className='bg-slate-400'>
            <Heading as="h1" size="4">Looper</Heading>
        </Section>

    )
}


export default Header;