/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/${postId}`, {
    method: "PATCH",
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

export const createPost = async (prevState: PostState, formData: FormData) => {
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    isPremium: formData.get("isPremium") === "on",
  };

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

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
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

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
  const result = res.json();
  return result;
};
