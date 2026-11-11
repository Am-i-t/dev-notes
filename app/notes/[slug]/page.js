
import { getNoteBySlug } from "@/lib/notes";
import { getCurrentUser } from "@/lib/auth";

import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import Link from "next/link";

export default async function NewsSlug({ params }) {

  const { slug } = await params;

  // 1. Fetch note information
  const noteInfo = await getNoteBySlug(slug);

  if (!noteInfo) {
    notFound();
  }

  // 2. Get currently logged-in user
  const user = await getCurrentUser();

  // 3. Check ownership
  const isOwner = user?.userId === noteInfo.owner;

  return (
    <>
      <header className="noteinfo-header">

        <div className="noteInfo-image">
          <Image
            src={noteInfo.image}
            alt={noteInfo.title}
            fill
            loading="eager"
            sizes="(max-width: 768px) calc(100vw - 4rem), (max-width: 1150px) 45vw, 500px"
          />
        </div>

        <div className="noteInfo-headerText">

          <h1>{noteInfo.title}</h1>

          <p className="noteInfo-createdAt">
            at {formatDate(noteInfo.createdAt)}
          </p>

          {/* Only owner can see Edit button */}
          {isOwner && (
            <Link
              href={`/notes/${slug}/edit`}
              className="noteInfo-btn"
            >
              Edit
            </Link>
          )}

        </div>
      </header>

      <main>
        <h3 className="noteInfo-content">
          {noteInfo.content}
        </h3>
      </main>
    </>
  );
}
