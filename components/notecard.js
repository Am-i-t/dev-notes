"use client";

import { formatDate } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

function imageLoader(config) {
  const urlStart = config.src.split("upload/")[0];
  const urlEnd = config.src.split("upload/")[1];
  const transformations = `w_200,q_${config.quality}`;
  return `${urlStart}upload/${transformations}/${urlEnd}`;
}

export default function NoteCard({
  title,
  slug,
  image,
  content,
  createdAt,
  onDelete,
  isPending,
  canManage,
}) {
  function check(content) {
    let snap = "";
    let spaceCount = 0;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === " ") {
        spaceCount++;
      }
      if (spaceCount !== 20) {
        snap += content[i];
      } else {
        return snap + "...";
      }
    }
  }

  return (
    <>
      <article className="post">
        <div className="post-image">
          {image && (
            <Image
              loader={imageLoader}
              src={image}
              width={200}
              height={120}
              alt={title}
              quality={75}
              loading="eager"
            />
          )}
        </div>
        <div className="post-content">
          <header>
            <div>
              <h2>{title}</h2>
              <p>
                <time dateTime={createdAt}>{formatDate(createdAt)}</time>
              </p>
            </div>
          </header>
          <p>{check(content)}</p>
        </div>
        <div className="post-action">
          <Link href={`/notes/${slug}`}>View Details</Link>
          {canManage && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(slug)}
              disabled={isPending}
            >
              Delete
            </button>
          )}
        </div>
      </article>
    </>
  );
}
