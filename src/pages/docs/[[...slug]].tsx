import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import { useRouter } from "next/router";
import { sortDocPages, getAdjacentPages } from "@/src/utils/docsOrder";
import Layout from "@/src/components/Layout";
import { Box, Container, Section } from "@radix-ui/themes";

interface DocPageProps {
  content: string;
  title: string;
  pages: Array<{ slug: string; title: string }>;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

const Sidebar: React.FC<{ pages: Array<{ slug: string; title: string }> }> = ({
  pages,
}) => {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <nav className="w-52 pr-8">
      <ul>
        {pages.map((page) => (
          <li key={page.slug} className="mb-4">
            <Link
              href={page.slug === "index" ? "/docs" : `/docs/${page.slug}`}
              className={`underline underline-offset-2 hover:no-underline decoration-gray-300 ${
                currentPath ===
                (page.slug === "index" ? "/docs" : `/docs/${page.slug}`)
                  ? "font-bold no-underline"
                  : ""
              }`}
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const DocPage: React.FC<DocPageProps> = ({
  content,
  title,
  pages,
  prev,
  next,
}) => {
  return (
    <Layout>
      <Container mt="8">
        <Section>
          <div className="flex gap-8">
            <Sidebar pages={pages} />
            <div className="flex-grow max-w-2xl prose">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <div className="mt-8 flex justify-between">
                {prev && (
                  <Box>
                    ←{" "}
                    <Link
                      href={
                        prev.slug === "index" ? "/docs" : `/docs/${prev.slug}`
                      }
                      className="underline-offset-3 decoration-gray-300 hover:no-underline transition"
                    >
                      {prev.title}
                    </Link>
                  </Box>
                )}
                {next && (
                  <Box>
                    <Link
                      href={`/docs/${next.slug}`}
                      className="underline-offset-3 hover:no-underline decoration-gray-300 transition"
                    >
                      {next.title}
                    </Link>{" "}
                    →
                  </Box>
                )}
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join("src", "content", "docs"));

  const paths = files.map((filename) => ({
    params: {
      slug: filename === "index.md" ? [] : [filename.replace(".md", "")],
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[] | undefined;
  const currentSlug = slug ? slug[0] : "index";
  const filePath = path.join("src", "content", "docs", `${currentSlug}.md`);

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  // Get all pages for the sidebar
  const files = fs.readdirSync(path.join("src", "content", "docs"));
  const pages = files.map((filename) => {
    const filePath = path.join("src", "content", "docs", filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug: filename.replace(".md", ""),
      title: data.title,
    };
  });

  // Sort the pages according to the defined order
  const sortedPages = sortDocPages(pages);

  // Get adjacent pages
  const { prev, next } = getAdjacentPages(currentSlug, sortedPages);

  return {
    props: {
      content: contentHtml,
      title: currentSlug === "index" ? "Understand Looper" : data.title,
      pages: sortedPages,
      prev,
      next,
    },
  };
};

export default DocPage;
