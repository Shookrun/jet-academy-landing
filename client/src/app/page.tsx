import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default function RootPage() {
  const headersList = headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  let locale = "az";

  if (acceptLanguage.includes("ru")) {
    locale = "ru";
  } else if (acceptLanguage.includes("az")) {
    locale = "az";
  }

  redirect(`/${locale}`);
}
