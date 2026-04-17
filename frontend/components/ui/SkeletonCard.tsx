export function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4">
      <div className="skeleton h-80 rounded-[1.35rem] animate-shimmer" />
      <div className="skeleton h-4 w-24 rounded-full animate-shimmer" />
      <div className="skeleton h-5 w-44 rounded-full animate-shimmer" />
      <div className="skeleton h-4 w-20 rounded-full animate-shimmer" />
    </div>
  );
}