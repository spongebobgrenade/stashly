"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search your memory..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border p-3"
    />
  );
}