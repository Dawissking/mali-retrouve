export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Mali Retrouvé" role="img">
      <circle cx="35" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="8" />
      <circle cx="65" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.7" />
    </svg>
  );
}
