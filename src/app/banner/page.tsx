import Image from "next/image";

export const metadata = {
  title: "HackX 4.0 — Previous Year Mail Banner",
};

// Full-screen overlay so only the banner is visible, hiding navbar/footer.
export default function BannerPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <Image
        src="/assets/logos/previous-year-mail-banner.svg"
        alt="Previous Year Mail Banner"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
