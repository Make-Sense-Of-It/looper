---
title: Understanding the different models
---

Currently Looper supports models for OpenAI and Anthropic. None of the models is necessarily “better” than any other but all have different tradeoffs.

The way I’ve seen others use the tool is to start with the cheapest model (as of October 2024 that’s GPT 4o mini) and start going up the scale if the cheaper models don’t perform the expected task.

If you’re not already familiar with them you may find the following useful:

 - Anthropic [model comparison table](https://docs.anthropic.com/en/docs/about-claude/models#model-comparison-table)  
 - OpenAI [model pricing table](https://openai.com/api/pricing/)

### Anthropic

 - **Claude 3.5 Sonnet**: most capable model based on current benchmarks. Use it for aspects involving creativity and synthesis  
 - **Claude 3 Haiku**: very fast and relatively inexpensive. Potentially least accurate of the models

### OpenAI

 - **GPT-4o**: OpenAI’s most well-rounded model. Similar to Claude’s 3.5 Sonnet, though perhaps not quite as capable, though is slightly cheaper  
 - **GPT-4o mini**: very fast and the least expensive model, but despite that surprisingly capable. It isn’t far off the GPT-4 performance  
 - **o1-mini**: uses chain-of-thought reasoning and still feels quite experimental. Potentially useful if you’re analysing hard to reason data 