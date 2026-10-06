export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark${className ? ` ${className}` : ""}`} aria-hidden="true">
      <img src="/logo-wave.jpg" alt="" className="brand-mark-img" />
    </span>
  );
}
