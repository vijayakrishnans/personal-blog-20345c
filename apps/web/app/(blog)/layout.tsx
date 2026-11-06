import "../globals.css";

import type { Metadata } from "next";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import AlertBanner from "./alert-banner";
import { CloudflareWebAnalytics } from "./analytics";
import ConnectSanityNotice from "./connect-sanity";
import PortableText from "./portable-text";

import { isSanityConfigured } from "@/sanity/lib/api";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

// Upstream pre-renders the blog at build and refreshes it with time-based
// revalidation (60 s, matching Sanity's API CDN TTL). The Worker serves
// pre-rendered pages from a read-only static-assets cache, which cannot
// revalidate — and a credential-free build has no project to pre-render from.
// So every blog route renders on request against Sanity's API CDN, whose
// 60 s TTL gives the same freshness.
export const dynamic = "force-dynamic";
// The fetch-level `revalidate: 60` in sanity/lib/fetch.ts would still write
// Next's data cache, and on the static-assets cache every write is refused
// and logged. Sanity's API CDN is the 60 s cache here.
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <section className="min-h-screen">
          {isDraftMode && <AlertBanner />}
          {!isSanityConfigured && <ConnectSanityNotice />}
          <main>{children}</main>
          <footer className="bg-accent-1 border-accent-2 border-t">
            <div className="container mx-auto px-5">
              {footer.length > 0 ? (
                <PortableText
                  className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
                  value={footer as PortableTextBlock[]}
                />
              ) : (
                <div className="flex flex-col py-16 md:py-20">
                  {/* About / Author section */}
                  <div className="mx-auto max-w-xl text-center mb-12">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-gray-700">
                      V
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Vijayakrishnan</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Platform engineer and builder. Writing about software, AI,
                      and the craft of building things that last.
                    </p>
                  </div>
                  <div className="flex flex-col items-center lg:flex-row lg:justify-between border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500 mb-4 lg:mb-0">
                      &copy; {new Date().getFullYear()} Vijayakrishnan
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com/vijayakrishnan"
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                      >
                        GitHub
                      </a>
                      <a
                        href="https://twitter.com/vijayakrishnan"
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </footer>
        </section>
        {isDraftMode && <VisualEditing />}
        <CloudflareWebAnalytics />
      </body>
    </html>
  );
}
