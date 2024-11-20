import { GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Layout from "../components/Layout";
import { Container, Section } from "@radix-ui/themes";

interface AboutPageProps {
  content: string;
}

export default function AboutPage({ content }: AboutPageProps) {
  return (
    <Layout>
      <Container mt={"8"}>
        <Section>
          <article className="prose">
            <h1>About looper</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </Section>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "src", "content", "about.md");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      content: contentHtml,
    },
  };
};
