import React from "react";
import { Link, Text, Flex } from "@radix-ui/themes";

const Footer: React.FC = () => {
  return (
    <footer>
      {/* <Section size={"1"}> */}
      <Flex gap="2" align={"center"}>
        <Text size="2" className="text-bronze-11">
          <Link
            underline="always"
            target="_blank"
            href="https://github.com/Make-Sense-Of-It/looper"
          >
            Github
          </Link>
        </Text>
        •
        <Text size="2" className="text-bronze-11">
          <Link
            underline="always"
            target="_blank"
            href="https://make-sense-of-it.com"
          >
            Make Sense Of It
          </Link>
        </Text>
      </Flex>
      <Text as="div" size="1" className="text-bronze-11">
        Made with <span className="text-black">&hearts;</span> in{" "}
        <Link
          underline="always"
          target="_blank"
          href="https://it.wikipedia.org/wiki/Cuneo"
        >
          Cuneo
        </Link>
        , Italy
      </Text>
      {/* </Section> */}
    </footer>
  );
};

export default Footer;
