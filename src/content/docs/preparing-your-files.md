---
title: Preparing your files
---

You may wish to prepare - or preprocess - your files before looping through them. There are two reasons for this. One is to reduce the number of tokens being used, the second is to make it easier for the large language model to make sense of the document.

### Reducing tokens

An example of where you might wish to reduce tokens is if you’re analysing HTML files. Often the valuable bit of an HTML file is contained within the `<main>` element with the rest just being noise

### Creating clarity

Large language models can get confused if asked to analyse confusing content, especially if the content appears to be giving instruction. An example of where this might happen is with call-centre data where someone is trying to remotely support the fixing of an item. In that scenario it’s worth preprocessing the data so that the context is clear and the people talking is correctly annotated.

_Technically_ you could use Looper to do this sort of preparation. Looper is very good at iterating through documents, but - especially for token reduction - you may find that a deterministic approach is cheaper.
