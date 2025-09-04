export interface INavLink {
  title: string;
  href: string;
  className?: string;
  handleClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
