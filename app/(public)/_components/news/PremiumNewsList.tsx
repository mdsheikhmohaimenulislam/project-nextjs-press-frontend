import { IPost } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { getPremiumNews } from "@/app/(public)/_actions/getPremiumNews";

export async function PremiumNewsList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const query = searchParams ? await searchParams : undefined;

  const result = await getPremiumNews({ query });

  console.log("PREMIUM UI RESULT:", result);


  if (!result?.success || !Array.isArray(result?.data) || result.data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No premium news found.
      </div>
    );
  }


  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {result.data.map((post: IPost) => (
          <NewsCard
            key={post.id}
            post={post}
          />
        ))}

      </div>

    </div>
  );
}