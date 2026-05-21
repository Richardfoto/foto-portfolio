import { redirect } from "next/navigation";
import { isLocale } from "@/lib/site";

type LocaleParams = Promise<{ locale: string }>;

export default async function ForgatasMeneteRedirect(props: {
  params: LocaleParams;
}) {
  const { locale: rawLocale } = await props.params;
  const locale = isLocale(rawLocale) ? rawLocale : "hu";

  redirect(`/${locale}/roviden`);
}
