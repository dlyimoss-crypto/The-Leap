import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage(props: PageProps<"/sign-in">) {
  const searchParams = await props.searchParams;
  const modeParam = Array.isArray(searchParams.mode)
    ? searchParams.mode[0]
    : searchParams.mode;
  const initialMode = modeParam === "sign-up" ? "sign-up" : "sign-in";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <SignInForm initialMode={initialMode} />
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        variant="ghost"
        size="sm"
      >
        Back
      </Button>
    </main>
  );
}
