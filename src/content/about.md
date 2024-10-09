---
title: About Looper
---

Looper lets a large language model loop over your files. It’s really very simple. But it’s useful. 

Large language models now have very large context windows and they have become a lot more attentive to that context. They will continue to improve. But, from using LLMs in the wild, it still seems to be the case that the results are better if you share the most relevant piece of information that you want analysed each time.

That’s where Looper comes in. Looper will take a zip file of documents, will share them one at a time with your choice of large language model and return the results as a zip file. 

It means you don’t need to mangle multiple files into a single one, and means less worrying about context window sizes.

## Use cases

Looper is built for research. Here are some things it’s been used for:

#### Sentiment analysis

Working through 30 customer conversations to identify sentiment analysis and how it changed as different questions were being asked

#### Category identification

Sharing just over 1000 proposals and asking it to categorise the different technologies being used as a semi-colon separated list for future analyse

#### Text extraction

Taking a 300-page website that had no consistent structure between the pages and converting each file to markdown to make it easier to migrate

## Background

Looper was created after I’d made around 10 Python apps that were all basically doing the same thing. They took a bunch of documents from my computer and sent them one-by-one to a version of Llama, GPT or Claude.

I work in strategic design and innovation, that means understanding problems that people have. Figuring out those problems might come from transcriptions of conversations I’ve had with folks, call-centre records, proposal documents or server logs. All of these things _can_ be analysed manually but it’s both slow and very open to biases that get caused by inattentiveness.

Rather than creating an 11th Python app where the only thing that changed was a prompt, or model name, it felt like it’d be better to create a web app that could be used across all my different projects. 
