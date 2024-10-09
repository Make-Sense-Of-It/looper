export const docsOrder = [
    'index',
    'quick-start',
    'getting-an-api-key',
    'understanding-the-different-models',
    'starting-a-project',
    'prepare-your-prompt',
    'preparing-your-files',
    'token-and-api-limits',
    'downloading-your-files',
    'safety'
];

export function sortDocPages(pages: Array<{ slug: string, title: string }>) {
    return pages.sort((a, b) => {
        const indexA = docsOrder.indexOf(a.slug);
        const indexB = docsOrder.indexOf(b.slug);
        if (indexA === -1) return 1;  // Put any pages not in the order at the end
        if (indexB === -1) return -1;
        return indexA - indexB;
    }).map(page => ({
        ...page,
        title: page.slug === 'index' ? 'Docs home' : page.title
    }));
}

export function getAdjacentPages(currentSlug: string, pages: Array<{ slug: string, title: string }>) {
    const currentIndex = pages.findIndex(page => page.slug === currentSlug);
    return {
        prev: currentIndex > 0 ? pages[currentIndex - 1] : null,
        next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
    };
}