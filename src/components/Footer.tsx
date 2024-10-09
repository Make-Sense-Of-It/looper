import React from 'react';
import { Link, Section, Text } from '@radix-ui/themes';

const Footer: React.FC = () => {
    return (
        <Section size={"1"}>
            <Text as="div" size="1">Made with ❤ in <Link target="_blank" href="https://it.wikipedia.org/wiki/Cuneo">Cuneo</Link>, Italy</Text>
        </Section>
    )
}


export default Footer;