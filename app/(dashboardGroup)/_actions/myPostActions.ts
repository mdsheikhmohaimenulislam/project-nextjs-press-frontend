/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { isAccessTokenExist } from "@/service/refreshToken";
import { revalidateTag } from "next/cache";

type PostState = {
  success: true;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

export const updatePost = async (
  postId: string,
  prevState: PostState,
  formData: FormData,
) => {
  const payload = {
    title: formData.get("title") ?? "",
    content: formData.get("content") ?? "",
    thumbnail: formData.get("thumbnail") ?? "",
    tags: (formData.get("tags") as string).split(", ") ?? "",
    isPremium: formData.get("isPremium") === "on",
  };

  // const cookieStore = await cookies();

  // const accessToken = cookieStore.get("accessToken")?.value || null;

  // if (!accessToken) {
  //   return {
  //     success: false,
  //     message: "User not logged in!",
  //   };
  // }

  const accessToken = await isAccessTokenExist();

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        cookie: `accessToken=${accessToken}`,
        "content-type": "application/json",
      },

      body: JSON.stringify(payload),
    },
  );
  const result = await res.json();

  if (result.success) {
    revalidateTag("my-post", {
      expire: 0,
    });
  }

  if (result.success && result.data.isPremium) {
    revalidateTag("premium-post", {
      expire: 0,
    });
  } else {
    revalidateTag("public-post", {
      expire: 0,
    });
  }

  return result;
};

export const createPost = async (prevState: PostState, formData: FormData) => {
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    isPremium: formData.get("isPremium") === "on",
  };

  // const cookieStore = await cookies();

  // let accessToken = cookieStore.get("accessToken")?.value || null;
  // const refreshToken = cookieStore.get("refreshToken")?.value || null;
  // if (!accessToken && !refreshToken) {
  //   return {
  //     success: false,
  //     message: "User not logged in!",
  //   };
  // }

  // const decodedAccessToken = accessToken
  //   ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
  //   : null;
  // const decodedRefreshToken = refreshToken
  //   ? jwtUtils.verifyToken(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET as string,
  //     )
  //   : null;

  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //   //access token has expired but refresh token is valid, get new access token from backend
  //   const result = await getNewAccessToken();

  //   if (result.success) {
  //     const newAccessToken = result.data.accessToken;

  //     cookieStore.set("accessToken", newAccessToken, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24,
  //       sameSite: "lax",
  //     });

  //     accessToken = newAccessToken;
  //   }
  // }

  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      cookie: `accessToken=${accessToken}`,
      "content-type": "application/json",
    },

    body: JSON.stringify(payload),
  });
  const result = await res.json();

  if (result.success) {
    revalidateTag("my-post", {
      expire: 0,
    });
  }

  if (result.success && result.data.isPremium) {
    revalidateTag("premium-post", {
      expire: 0,
    });
  } else {
    revalidateTag("public-post", {
      expire: 0,
    });
  }

  return result;
};

export const getMyPosts = async () => {
  const accessToken = await isAccessTokenExist();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    // cache: "force-cache",
    // next: {
    //   revalidate: 60 * 60 * 24,
    //   tags: ["my-post"],
    // },
  });
  const result = await res.json();
  console.log("MY POSTS RESULT:", result);
  return result;
};
