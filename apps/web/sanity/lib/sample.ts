/**
 * The sample posts a blog with no Sanity project renders.
 *
 * A fresh deploy has no Sanity project behind it — the project id is the
 * owner's to add — and it must still serve a blog, not a 500. So until the
 * build is given a project id (sanity/lib/api.ts), `sanityFetch` answers the
 * blog's four queries from this file instead of from a dataset, with the same
 * result shapes TypeGen derives for them. Once a project id is set, nothing
 * here is read.
 *
 * Unlike the template, these are the owner's own articles, published here
 * first. When a Sanity project is connected, the Studio becomes the authoring
 * tool and these are no longer served.
 */
import type { QueryParams } from "next-sanity";

import { SITE_NAME } from "@/app/site";
import type { MoreStoriesQueryResult, PostQueryResult } from "@/sanity.types";
import {
  heroQuery,
  moreStoriesQuery,
  postQuery,
  settingsQuery,
} from "@/sanity/lib/queries";

type SamplePost = NonNullable<PostQueryResult>;
type Block = NonNullable<SamplePost["content"]>[number];

let keys = 0;
const key = () => `sample${(keys++).toString(36)}`;

function span(text: string, marks: string[] = []) {
  return { _type: "span" as const, _key: key(), text, marks };
}

function para(...parts: Array<string | { text: string; href: string }>): Block {
  const markDefs: NonNullable<Block["markDefs"]> = [];
  const children = parts.map((part) => {
    if (typeof part === "string") return span(part);
    const mark = key();
    markDefs.push({ _type: "link", _key: mark, href: part.href });
    return span(part.text, [mark]);
  });
  return { _type: "block", _key: key(), style: "normal", markDefs, children };
}

function heading(text: string, style: "h2" | "h3" = "h3"): Block {
  return { _type: "block", _key: key(), style, markDefs: [], children: [span(text)] };
}

function bullet(text: string): Block {
  return { _type: "block", _key: key(), style: "normal", listItem: "bullet", markDefs: [], children: [span(text)] };
}

const author = {
  name: "Vijayakrishnan",
  picture: null,
  biography: [
    {
      _key: key(),
      _type: "block" as const,
      style: "normal" as const,
      markDefs: [],
      children: [
        {
          _type: "span" as const,
          _key: key(),
          text: "Platform engineer and builder. Writing about software, AI, and the craft of building things that last.",
          marks: [],
        },
      ],
    },
  ],
};

function post(
  slug: string,
  title: string,
  date: string,
  excerpt: string,
  content: Block[],
  categories: string[] = [],
): SamplePost {
  return {
    _id: `sample.${slug}`,
    status: "published",
    title,
    slug,
    excerpt,
    coverImage: null,
    date,
    author,
    content,
    categories,
  };
}

/** Newest first, as the queries order them. */
export const samplePosts: SamplePost[] = [
  post(
    "how-to-get-hired-in-the-ai-era",
    "How to get hired in the AI era",
    "2026-11-01T09:00:00.000Z",
    "The rules of hiring have changed. Here is what actually matters when AI can write code, review resumes, and interview candidates.",
    [
      para(
        "Every week another article tells you AI is coming for your job. That is the wrong framing. The right question is not whether AI will replace you, but what the new bar looks like now that everyone has access to the same tools. I have been on both sides of the hiring table — as a candidate and as someone who evaluates engineers — and the signal has shifted in ways most advice has not caught up with.",
      ),
      heading("The baseline has moved"),
      para(
        "A year ago, being able to write a function from scratch was a core skill. Today, every candidate who shows up can prompt their way through a coding problem. The interviewer knows this. So the evaluation has moved past the code itself and onto what surrounds it: how you think about the problem before you type anything, how you validate the output, and how you handle the edge cases the AI did not consider.",
      ),
      para(
        "The candidates who stand out are not the ones who write the most code. They are the ones who understand the system the code lives in. They can explain why a particular approach was chosen over alternatives. They know when to trust the AI and when to override it. That judgment is what experience buys, and no amount of prompting substitutes for it.",
      ),
      heading("What interviewers actually look for now"),
      para(
        "Having interviewed dozens of engineers over the past year, I have noticed a pattern. The evaluation has three tiers:",
      ),
      heading("1. Can you navigate ambiguity?"),
      para(
        "The easiest thing for AI to produce is a solution to a well-defined problem. The hardest thing for AI to do is figure out which problem to solve. In interviews, this shows up as the ability to ask clarifying questions, push back on vague requirements, and scope the work before starting. Candidates who jump straight to code without understanding the context are indistinguishable from someone who pasted a prompt output.",
      ),
      heading("2. Can you reason about trade-offs?"),
      para(
        "Every engineering decision is a trade-off. AI can generate three approaches to a problem, but it cannot tell you which one fits your team's constraints — your latency budget, your deployment model, your team's familiarity with the stack. The candidates who impress are the ones who can articulate why they picked one approach over another, not just that they picked it.",
      ),
      heading("3. Can you own an outcome?"),
      para(
        "Code is the easy part. Deployment, monitoring, incident response, communicating with stakeholders — that is where the work lives. Interviewers are looking for evidence that you have seen a thing through from idea to production and dealt with the mess in between. The AI can write the PR. It cannot be on call for it.",
      ),
      heading("What this means for your job search"),
      para(
        "The practical implications are straightforward. First, your portfolio matters more than your resume. A GitHub profile with well-documented projects that solve real problems tells a story a resume never can. Second, your ability to communicate about your work is as important as the work itself. Write about what you built, why you built it that way, and what you learned. Third, specialize. The generalist who can do a little of everything is the most easily replaced by AI. The person with deep knowledge of a domain — payments, infrastructure, developer tooling — has context that an LLM does not.",
      ),
      heading("The counterintuitive advantage"),
      para(
        "Here is what surprised me: the people who are most anxious about AI in hiring are often the strongest candidates. They are the ones who understand the technology well enough to see how much it can do, and they overestimate how much of their own work it replaces. The people who are least worried are sometimes the ones who should be — because they do not see what is coming.",
      ),
      para(
        "If you are job hunting right now, your edge is not in competing with AI on its terms. It is in bringing the things AI cannot: judgment born of experience, taste in what good looks like, and the ability to navigate the human side of building software. Those are not going anywhere.",
      ),
    ],
    ["career", "AI", "engineering"],
  ),
  post(
    "agentic-coding",
    "Agentic coding",
    "2026-10-25T09:00:00.000Z",
    "What it means to code with agents that plan, execute, and verify — and why the developer's role becomes more interesting, not less.",
    [
      para(
        "There is a version of the future where developers become prompt engineers, typing instructions into a chat box and reviewing the output. I do not think that is where we are heading. What I see instead is a shift toward what I call agentic coding: working alongside agents that can plan, execute, verify, and iterate — but always within a framework that the developer defines and owns.",
      ),
      heading("What agentic coding is"),
      para(
        "Agentic coding is not autocomplete on steroids. It is not a single response to a single prompt. It is a loop: the developer expresses an intent, the agent decomposes it into steps, executes them, checks the results, and reports back. The developer reviews, adjusts, and re-engages. The agent handles the mechanics; the developer handles the judgment.",
      ),
      para(
        "A concrete example. Instead of writing a function to parse a CSV file, you tell the agent: I need a CSV parser that handles quoted fields, variable column counts, and malformed rows gracefully. The agent plans: it identifies the edge cases, writes the parser, adds tests, runs them, and surfaces the results. You review the test output, notice a case it missed, and refine the instruction. The agent updates the code and re-runs. What used to be a fifteen-minute coding session becomes a two-minute conversation.",
      ),
      heading("The architecture of an agentic coding system"),
      para(
        "The systems that enable this have a common shape. There is a planner that decomposes high-level intent into a sequence of operations. There is an executor that carries out each operation — writing files, running commands, querying APIs. There is a verifier that checks the output against the intent. And there is a loop that ties them together, feeding verification results back into the planner for refinement.",
      ),
      para(
        "What makes this different from earlier automation efforts is the granularity of the loop. Previous tools automated individual keystrokes or refactoring patterns. Agentic systems automate entire workflows — not because the code is simpler, but because the loop lets the agent recover from mistakes without human intervention.",
      ),
      heading("What the developer brings"),
      para(
        "The common fear is that this makes developers redundant. I have found the opposite. The more capable the agent, the more valuable the developer's judgment becomes. Someone has to decide what to build, in what order, to what standard. Someone has to know when the agent's output is good enough and when it is subtly wrong. Someone has to own the outcome.",
      ),
      para(
        "The developers who thrive in this model are not the ones who write the fastest code. They are the ones who can articulate intent clearly, who have good taste in what good looks like, and who can hold a mental model of the system while delegating implementation details to the agent.",
      ),
      heading("Where it breaks down"),
      para(
        "Agentic coding is not a silver bullet. It struggles with problems that require deep context across many files. It can chase its own tail when the verification step is poorly defined. It can produce code that passes tests but is structurally wrong — the right answer to the wrong question. And it is only as good as the developer's ability to recognize when the agent is going down a dead end.",
      ),
      para(
        "The skill of the future, then, is not coding. It is debugging the agent. Understanding what went wrong and why, and knowing how to adjust the intent or the constraints to steer it back. That is a harder skill than writing the code yourself, because it requires you to hold the full picture while the agent handles the pieces.",
      ),
      heading("The shape of things to come"),
      para(
        "We are early in this transition. The tools are improving rapidly, but the workflows around them are still being invented. The teams that figure out how to integrate agentic coding into their development process — not as a replacement for developers, but as a force multiplier — will ship faster, with fewer bugs, and with more time spent on the problems that matter.",
      ),
      para(
        "The developer who learns to work this way is not being replaced. They are being upgraded.",
      ),
    ],
    ["engineering", "AI", "tools"],
  ),
];

// A more-stories row is a post without its body.
function summary(post: SamplePost): MoreStoriesQueryResult[number] {
  const { _id, status, title, slug, excerpt, coverImage, date, author, categories } = post;
  return { _id, status, title, slug, excerpt, coverImage, date, author, categories };
}

/**
 * Answers one of the blog's queries (sanity/lib/queries.ts) from the samples,
 * as the dataset would. There is no Settings document: the layout falls back
 * to the blog's name and the template's description, as it does for an empty
 * dataset.
 */
export function sampleFetch(query: string, params: QueryParams): unknown {
  switch (query) {
    case settingsQuery:
      return null;
    case heroQuery:
      return samplePosts[0] ?? null;
    case moreStoriesQuery: {
      const limit = typeof params.limit === "number" ? params.limit : samplePosts.length;
      return samplePosts
        .filter((p) => p._id !== params.skip)
        .slice(0, limit)
        .map(summary);
    }
    case postQuery:
      return samplePosts.find((p) => p.slug === params.slug) ?? null;
    default:
      return null;
  }
}
