import React from 'react';
import { Link, Text } from '@radix-ui/themes';

const Footer: React.FC = () => {
    return <Text as="div" size="1" mt="4">Made with ❤ in <Link target="_blank" href="https://it.wikipedia.org/wiki/Cuneo">Cuneo</Link>, Italy</Text>
}


export default Footer;