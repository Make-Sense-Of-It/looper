# Looper
Looper lets a large language model loop over your files. It’s really very simple. But it’s useful.

Large language models now have very large context windows and they have become a lot more attentive to that context. They will continue to improve. But, from using LLMs in the wild, it still seems to be the case that the results are better if you share the most relevant piece of information that you want analysed each time.

That’s where Looper comes in. Looper will take a zip file of documents, will share them one at a time with your choice of large language model and return the results as a zip file.

It means you don’t need to mangle multiple files into a single one, and means less worrying about context window sizes.

## Explainer video
![A video explaining Looper](https://github.com/user-attachments/assets/8633cc6d-ae3f-4359-a81f-1ff81dd3c6f8)

## Motivation
We put this together because we found ourselves frequently making the same type of Python project that was just looping over files. On our 11th go we thought it would make sense to create something others could use beyond the team.

## Running locally
This is a standard NextJs project that's using the pages router.
 - Clone the repo
 - Run `npm i`
 - Run `npm run dev`

You should be good to go.

## .env files
You will need to add an .env.local file. The minimum env field you need to set is `NEXT_PUBLIC_API_URL=`.

## Models + API keys
At the moment the project only works with OpenAI and Anthropic. It would be straightforward to fork and get it working with other models. You'll need an API key from one of those providers. API keys are stored client side.

## Hosted version
There is a hosted version of the service at [llmlooper.com](https://llmlooper.com)