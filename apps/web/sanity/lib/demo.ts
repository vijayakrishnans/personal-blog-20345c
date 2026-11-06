/**
 * Demo data used as placeholders and initial values for the blog
 */

import { SITE_NAME } from "@/app/site";

// The blog's name until its Settings document gives one (app/site.ts).
export const title = SITE_NAME;

export const description = [
  {
    _key: "9f1a629887fd",
    _type: "block",
    children: [
      {
        _key: "4a58edd077880",
        _type: "span",
        marks: [],
        text: "Thoughts on software, AI, and building things that matter. By Vijayakrishnan.",
      },
    ],
    markDefs: [],
    style: "normal",
  },
];

export const ogImageTitle = "Vijayakrishnan — Personal Blog";
