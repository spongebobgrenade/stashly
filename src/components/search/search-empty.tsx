export function SearchEmpty() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-muted-foreground">
        No memories found
      </p>

      <p className="text-xs text-muted-foreground mt-2">
        Try another keyword
      </p>
    </div>
  );
}