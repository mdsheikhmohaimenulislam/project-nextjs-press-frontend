"use server";

import { cookies } from "next/headers";

export const getPremiumNews = async ({
  query,
}: {
  query?: { [key: string]: string | string[] | undefined };
}) => {
  // Bad Approach
  // const searchTerm = `${search?.searchTerm ? `?searchTerm=${search.searchTerm}` : ""}`;

  const params = new URLSearchParams();

  if (query && query.searchTerm) {
    params.set("searchTerm", query.searchTerm as string);
  }

  //  /premium?searchTerm=nextjs
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    // throw new Error("User Not Logged In!");

    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const url = params.toString()
    ? `${process.env.BACKEND_API_URL}/api/Premium?${params.toString()}`
    : `${process.env.BACKEND_API_URL}/api/Premium`;

  console.log(url);

  const res = await fetch(url, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  const result = await res.json();
console.log(
  "NEXT RESULT:",
  JSON.stringify(result, null, 2)
);


  return result;
};
