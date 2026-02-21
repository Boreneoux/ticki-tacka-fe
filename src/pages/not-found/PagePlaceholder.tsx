export default function PagePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Coming Soon</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        This page is under construction. Check back soon!
      </p>
    </div>
  );
}
