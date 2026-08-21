export type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

export const buildPageTokens = (
  currentPage: number,
  totalPages: number,
): PageToken[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PageToken[] = [1];

  if (currentPage > 3) tokens.push('ellipsis-start');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    tokens.push(page);
  }

  if (currentPage < totalPages - 2) tokens.push('ellipsis-end');

  tokens.push(totalPages);

  return tokens;
};

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationBar = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationBarProps) => {
  if (totalPages <= 1) return null;

  const tokens = buildPageTokens(currentPage, totalPages);

  const navBtnStyle: React.CSSProperties = {
    width: 26,
    height: 26,
    padding: 0,
    fontSize: 13,
    lineHeight: 1,
    flexShrink: 0,
  };

  return (
    <div className='d-flex align-items-center justify-content-between px-3 py-2 border-top bg-light-subtle'>
      <span
        className='text-muted'
        style={{ fontSize: 12, whiteSpace: 'nowrap' }}
      >
        Page {currentPage} of {totalPages}
      </span>
      <div className='d-flex align-items-center gap-1'>
        <button
          type='button'
          className='btn btn-sm bg-light-primary  btn-light-dark border-0 rounded-circle d-flex align-items-center justify-content-center'
          style={navBtnStyle}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label='Previous page'
        >
          ‹
        </button>

        {tokens.map((token, idx) =>
          token === 'ellipsis-start' || token === 'ellipsis-end' ? (
            <span
              key={`${token}-${idx}`}
              className='text-muted d-flex align-items-center justify-content-center'
              style={{ width: 26, height: 26, fontSize: 12 }}
            >
              …
            </span>
          ) : (
            <button
              key={token}
              type='button'
              className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${
                token === currentPage
                  ? 'btn-primary text-white'
                  : 'btn-light-dark border-0 text-dark'
              }`}
              style={{
                ...navBtnStyle,
                fontWeight: token === currentPage ? 600 : 400,
              }}
              onClick={() => onPageChange(token)}
              aria-current={token === currentPage ? 'page' : undefined}
            >
              {token}
            </button>
          ),
        )}

        <button
          type='button'
          className='btn btn-sm btn-light-dark bg-light-primary border-0 rounded-circle d-flex align-items-center justify-content-center'
          style={navBtnStyle}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label='Next page'
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
