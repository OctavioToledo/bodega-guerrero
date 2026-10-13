/** Filete dorado con un rombo al centro. */
export function Ornamento({ className = '' }: { className?: string }) {
  return (
    <div className={`ornamento ${className}`} aria-hidden>
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
      </svg>
    </div>
  )
}
