import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className={
            currentPage === 1 ? "pointer-events-none text-zinc-400" : ""
          }
        >
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem className="pointer-events-none">
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className={
            currentPage === totalPages
              ? "pointer-events-none text-zinc-400"
              : ""
          }
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
