export function Footer() {
  return (
    <footer className="px-8 pt-32 pb-16 text-center text-zinc-600 dark:text-zinc-400">
      &copy; {new Date().getFullYear()} Haffi Mazhar
      <small className="mt-4 block text-xs uppercase">Built with TanStack Start</small>
    </footer>
  );
}
