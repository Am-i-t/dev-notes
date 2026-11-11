"use client";

import { deleteNoteAction } from "@/actions/actionNotes";
import { useOptimistic, useState, useTransition } from "react";
import NoteCard from "./notecard";
import Link from "next/link";

function getPaginationRange(currentPage, totalPages) {
  const delta = 1;

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  const pages = [];

  pages.push(1);

  if (left > 2) {
    pages.push("...");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < totalPages - 1) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function NoteListClient({
  notes,
  currentUserId,
  currentPage,
  totalPages,
  totalNotes,
}) {
  const pages = getPaginationRange(currentPage, totalPages);
  const [optimisticNotes, addOptimitic] = useOptimistic(
    notes,
    (currNotes, slug) => currNotes.filter((note) => note.slug !== slug),
  );

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");

  function handleDelete(slug) {
    setError("");
    startTransition(async () => {
      addOptimitic(slug);

      try {
        await deleteNoteAction(slug);
      } catch (error) {
        setError("Note delete nahi ho paya. Dobara try karo.");
      }
    });
  }
  return (
    <>
      {error && <p role="alert">{error}</p>}

      <ul className="posts">
        {optimisticNotes.map((note) => (
          <li key={note._id.toString()}>
            <NoteCard
              {...note}
              onDelete={handleDelete}
              isPending={isPending}
              canManage={currentUserId !== null && note.owner === currentUserId}
            />
          </li>
        ))}
      </ul>

      {totalPages > 0 && (
        <div className="pagination-wrapper">
          <p className="pagination-info">
            Showing page {currentPage} of {totalPages} ({totalNotes} notes)
          </p>

          <div className="pagination">
            {/* Previous Button */}
            {currentPage > 1 ? (
              <Link
                href={`/notes?page=${currentPage - 1}`}
                className="pagination-btn"
                aria-label="Previous page"
              >
                <span>←</span> Previous
              </Link>
            ) : (
              <button className="pagination-btn disabled" disabled>
                <span>←</span> Previous
              </button>
            )}

            {/* Page Numbers */}
            <div className="pagination-numbers">
              {pages.map((page, index) =>
                page === "..." ? (
                  <span key={`dots-${index}`} className="pagination-dots">
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={`/notes?page=${page}`}
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Link>
                ),
              )}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={`/notes?page=${currentPage + 1}`}
                className="pagination-btn"
                aria-label="Next page"
              >
                Next <span>→</span>
              </Link>
            ) : (
              <button className="pagination-btn disabled" disabled>
                Next <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
