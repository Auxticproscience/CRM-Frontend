export function Pagination({ page, totalPages, total, pageSize, onPage }) {
  const from = Math.min((page - 1) * pageSize + 1, total)
  const to   = Math.min(page * pageSize, total)

  // Mostrar máx 5 páginas alrededor de la actual
  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        {total === 0 ? '0 resultados' : `${from}–${to} de ${total}`}
      </span>
      <div className="page-btns">
        <button className="page-btn" disabled={page === 1} onClick={() => onPage(1)}>«</button>
        <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
        {pages[0] > 1 && <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', padding: '0 4px' }}>…</span>}
        {pages.map(p => (
          <button
            key={p}
            className={`page-btn${p === page ? ' active' : ''}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', padding: '0 4px' }}>…</span>
        )}
        <button className="page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>›</button>
        <button className="page-btn" disabled={page === totalPages} onClick={() => onPage(totalPages)}>»</button>
      </div>
    </div>
  )
}
