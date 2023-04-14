/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useCallback, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PaginationButton({
  content,
  onClick,
  active,
  disabled,
}: {
  content: number | React.ReactNode;
  onClick: Function;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={`flex h-9 w-9 cursor-pointer flex-col items-center justify-center rounded-lg text-sm font-normal shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-colors
      ${active ? "!bg-blue-500 text-white" : "text-blue-500"}
      ${
        !disabled
          ? "bg-white hover:bg-blue-500 hover:text-white"
          : "cursor-not-allowed bg-white text-blue-300"
      }
      `}
      onClick={() => onClick()}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export function Pagination({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
}: {
  gotoPage: Function;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
}) {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 5;
    let numberOfButtons =
      pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = (pageIndices[0] as number) - 1;
      const pageNumberAfter =
        (pageIndices[pageIndices.length - 1] as number) + 1;
      if (
        pageNumberBefore >= 0 &&
        (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
      ) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <PaginationButton
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
        />
      </li>
    ));
  }, [pageCount, pageIndex]);
  return (
    <ul className="flex gap-2">
      <li>
        <PaginationButton
          content={
            <div className="ml-1 flex">
              <FaChevronLeft size="0.6rem" />
              <FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <PaginationButton
          content={
            <div className="ml-1 flex">
              <FaChevronRight size="0.6rem" />
              <FaChevronRight size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </li>
    </ul>
  );
}

export function PaginationWrapper({ children }: { children: React.ReactNode }) {
  return <div className="p6-3 flex justify-end px-6 py-3">{children}</div>;
}
