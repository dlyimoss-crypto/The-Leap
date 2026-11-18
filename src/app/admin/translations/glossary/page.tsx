import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALE_INFO } from "@/lib/i18n/locales";
import {
  isTranslationLocale,
  loadGlossary,
  TRANSLATION_LOCALES,
} from "@/lib/localization/admin-data";
import { deleteGlossaryTerm, saveGlossaryTerm } from "../actions";

export default async function GlossaryPage(props: PageProps<"/admin/translations/glossary">) {
  const { supabase } = await requireAdmin();
  const searchParams = await props.searchParams;
  const param = Array.isArray(searchParams.locale) ? searchParams.locale[0] : searchParams.locale;
  const locale = isTranslationLocale(param) ? param : TRANSLATION_LOCALES[0];

  const dict = getDictionary(await getLocale());
  const t = dict.admin.translations;
  const g = t.glossary;
  const terms = await loadGlossary(supabase, locale);

  const kindSelect = (value: string) => (
    <select
      name="kind"
      defaultValue={value}
      aria-label={`${t.kind.theology} / ${t.kind.product}`}
      className="h-8 rounded-lg border bg-transparent px-2 text-sm"
    >
      <option value="theology">{t.kind.theology}</option>
      <option value="product">{t.kind.product}</option>
    </select>
  );

  return (
    <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-6 py-10">
      <BackLink href={`/admin/translations?locale=${locale}`} label={t.back} />
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">{g.heading}</h1>
        <p className="text-sm text-muted-foreground">{g.intro}</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label={dict.language.pickerLabel}>
        {TRANSLATION_LOCALES.map((code) => (
          <Link
            key={code}
            href={`/admin/translations/glossary?locale=${code}`}
            lang={code}
            aria-current={code === locale ? "page" : undefined}
            className={
              code === locale
                ? "rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground"
                : "rounded-full border px-3 py-1 text-sm hover:bg-muted"
            }
          >
            {LOCALE_INFO[code].nativeName}
          </Link>
        ))}
      </nav>

      <form action={saveGlossaryTerm} className="grid gap-2 rounded-xl border bg-card p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
        <input type="hidden" name="locale" value={locale} />
        <Input name="source_term" placeholder={g.term} aria-label={g.term} required lang="en" />
        <Input name="approved_term" placeholder={g.approved} aria-label={g.approved} required lang={locale} />
        <Input name="notes" placeholder={g.notes} aria-label={g.notes} />
        {kindSelect("theology")}
        <Button type="submit" size="sm">{g.add}</Button>
      </form>

      <ul className="space-y-2">
        {terms.map((term) => (
          <li key={term.id} className="rounded-xl border bg-card p-3">
            <form action={saveGlossaryTerm} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto_auto]">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={term.id} />
              <Input name="source_term" defaultValue={term.source_term} aria-label={g.term} required lang="en" />
              <Input name="approved_term" defaultValue={term.approved_term} aria-label={g.approved} required lang={locale} />
              <Input name="notes" defaultValue={term.notes ?? ""} aria-label={g.notes} />
              {kindSelect(term.kind)}
              <Button type="submit" size="sm" variant="outline">{g.save}</Button>
            </form>
            <form action={deleteGlossaryTerm} className="mt-1 flex justify-end">
              <input type="hidden" name="id" value={term.id} />
              <Button type="submit" size="sm" variant="ghost" className="text-destructive">
                {g.delete}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
