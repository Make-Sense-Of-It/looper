import React from 'react';
import { Heading, Section } from '@radix-ui/themes';

const Header: React.FC = () => {
    return (
        <Section size="1" className=''>
            <Heading as="h1" size="4">Looper</Heading>
        </Section>

    )
}


export default Header;