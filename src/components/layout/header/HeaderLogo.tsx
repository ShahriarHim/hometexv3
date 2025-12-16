import { Link } from "@/i18n/routing";

export const HeaderLogo = () => {
  return (
    <Link href="/" className="flex items-center">
      <img
        src="/images/hometex-logo.png"
        alt="Hometex"
        width={120}
        height={80}
        className="h-[65px] w-auto"
      />
    </Link>
  );
};
