interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
      {title}
    </h1>
  );
}
