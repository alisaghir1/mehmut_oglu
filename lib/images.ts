export function isSupportedImageSource(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl || !URL.canParse(src)) return false;
  const url = new URL(src);
  return (
    url.protocol === "https:" &&
    url.hostname === new URL(projectUrl).hostname &&
    url.port === "" &&
    !url.username &&
    !url.password &&
    url.pathname.startsWith("/storage/v1/object/public/")
  );
}
