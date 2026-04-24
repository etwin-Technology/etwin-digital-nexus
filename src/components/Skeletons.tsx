export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl glass overflow-hidden">
      <div className="aspect-square bg-secondary/40 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
        <div className="h-5 w-1/3 bg-muted/60 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function DigitalCardSkeleton() {
  return (
    <div className="rounded-2xl glass-strong overflow-hidden">
      <div className="h-40 bg-secondary/40 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/2 bg-muted/60 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-muted/60 rounded animate-pulse" />
        <div className="h-3 w-full bg-muted/60 rounded animate-pulse" />
        <div className="h-9 w-full bg-muted/40 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl glass p-7 space-y-4">
      <div className="h-12 w-12 rounded-xl bg-muted/60 animate-pulse" />
      <div className="h-5 w-2/3 bg-muted/60 rounded animate-pulse" />
      <div className="h-3 w-full bg-muted/60 rounded animate-pulse" />
      <div className="h-3 w-5/6 bg-muted/60 rounded animate-pulse" />
    </div>
  );
}
