import React from "react";
import { Link, Text } from "@radix-ui/themes";

const Footer: React.FC = () => {
  return (
    <footer>
      {/* <Section size={"1"}> */}
        <Text as="div" size="1" className="text-bronze-11">
          Made with <span className="text-black">&hearts;</span> in{" "}
          <Link underline="always" target="_blank" href="https://it.wikipedia.org/wiki/Cuneo">
            Cuneo
          </Link>
          , Italy
        </Text>
      {/* </Section> */}
    </footer>
  );
};

export default Footer;
