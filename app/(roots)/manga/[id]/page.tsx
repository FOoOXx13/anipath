import { redirect } from "next/navigation";

export default function MangaPage({ params }: { params: any }) {
  redirect(`/manga/${params.id}/overview`);
}
