export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-800/60 border border-gray-700/50 animate-pulse">
      <div className="h-48 bg-gray-700/50 relative overflow-hidden">
        <div className="absolute inset-0 shimmer-effect" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700/60 rounded-full w-3/4 mx-auto" />
        <div className="h-4 bg-gray-700/40 rounded-full w-1/2 mx-auto" />
        <div className="flex justify-center gap-2">
          <div className="h-6 w-16 bg-gray-700/50 rounded-full" />
          <div className="h-6 w-16 bg-gray-700/50 rounded-full" />
        </div>
        <div className="h-8 bg-gray-700/30 rounded-lg w-2/3 mx-auto" />
      </div>
    </div>
  );
}
