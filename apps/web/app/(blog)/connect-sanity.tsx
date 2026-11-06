import Link from "next/link";

/**
 * Shown above every blog page while the build has no Sanity project id: the
 * posts below it are the bundled content (sanity/lib/sample.ts). Once a Sanity
 * project is connected, content is read from the dataset and this notice is gone.
 */
export default function ConnectSanityNotice() {
  return (
    <div
      role="status"
      data-sanity-notice="unconnected"
      className="border-b border-amber-200 bg-amber-50 text-amber-950"
    >
      <p className="container mx-auto px-5 py-3 text-center text-sm">
        <strong>Pre-published content.</strong> These articles are bundled with
        the site. Connect a{" "}
        <Link
          href="https://sanity.io"
          className="font-semibold underline hover:text-amber-700"
        >
          Sanity project
        </Link>{" "}
        to manage posts from the Studio at <code className="text-xs font-mono bg-amber-100 px-1 rounded">/studio</code>.
      </p>
    </div>
  );
}
