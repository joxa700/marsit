// Blog service — all mockAPI blog/comment requests live here.
const BASE_URL = (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/+$/, '');

export const BLOG_PAGE_SIZE = 10;
export const POST_TEXT_LIMIT = 1000;

function requireBaseUrl() {
  if (!BASE_URL) {
    throw new Error("VITE_MOCKAPI_URL topilmadi. .env faylini tekshiring.");
  }
}

async function request(path, { method = 'GET', body } = {}) {
  requireBaseUrl();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("Server bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
  }

  if (!response.ok) {
    const error = new Error(`Server xatosi: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeLikes(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizePost(post) {
  if (!post) return null;
  return {
    ...post,
    authorId: post.authorId != null ? String(post.authorId) : '',
    name: post.name || 'Foydalanuvchi',
    avatar: post.avatar || '',
    text: post.text || '',
    image: post.image || '',
    likes: normalizeLikes(post.likes),
    commentsCount: Math.max(0, Number(post.commentsCount) || 0),
    createdAt: post.createdAt || '',
  };
}

export function normalizeComment(comment) {
  if (!comment) return null;
  return {
    ...comment,
    postId: comment.postId != null ? String(comment.postId) : '',
    authorId: comment.authorId != null ? String(comment.authorId) : '',
    name: comment.name || 'Foydalanuvchi',
    avatar: comment.avatar || '',
    text: comment.text || '',
    createdAt: comment.createdAt || '',
  };
}

/**
 * Newest-first paginated feed.
 */
export async function getPosts({ page = 1, limit = BLOG_PAGE_SIZE } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: 'createdAt',
    order: 'desc',
  });

  try {
    const data = await request(`/blog?${query.toString()}`);
    return Array.isArray(data) ? data.map(normalizePost) : [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

/**
 * Admin helper: walk pages until the API returns a short page.
 */
export async function getAllPosts({ limit = 100, maxPages = 10 } = {}) {
  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const chunk = await getPosts({ page, limit });
    all.push(...chunk);
    if (chunk.length < limit) break;
  }
  return all;
}

export async function createPost({ authorId, name, avatar, text, image }) {
  const payload = {
    authorId: String(authorId),
    name,
    avatar: avatar || '',
    text: text || '',
    image: image || '',
    likes: [],
    commentsCount: 0,
    createdAt: new Date().toISOString(),
  };

  return normalizePost(await request('/blog', { method: 'POST', body: payload }));
}

/**
 * Deletes the post together with its comments (best effort per comment).
 */
export async function deletePost(id) {
  let comments = [];
  try {
    comments = await getComments(id);
  } catch {
    comments = [];
  }

  for (const comment of comments) {
    try {
      await deleteComment(comment.id);
    } catch {
      // Bitta izoh o'chmasa ham postni o'chirishga davom etamiz.
    }
  }

  await request(`/blog/${id}`, { method: 'DELETE' });
  return true;
}

export async function toggleLike(post, userId) {
  const uid = String(userId);
  const likes = normalizeLikes(post.likes);
  const nextLikes = likes.includes(uid)
    ? likes.filter(id => id !== uid)
    : [...likes, uid];

  const updated = await request(`/blog/${post.id}`, {
    method: 'PUT',
    body: { ...post, authorId: String(post.authorId), likes: nextLikes },
  });

  return normalizePost(updated);
}

export async function updateCommentsCount(post, commentsCount) {
  const updated = await request(`/blog/${post.id}`, {
    method: 'PUT',
    body: {
      ...post,
      authorId: String(post.authorId),
      commentsCount: Math.max(0, Number(commentsCount) || 0),
    },
  });

  return normalizePost(updated);
}

/**
 * mockAPI answers 404 for an empty/absent comments resource — that means
 * "no comments", not a hard error.
 */
export async function getComments(postId) {
  try {
    const data = await request(`/comments?postId=${encodeURIComponent(postId)}`);
    return Array.isArray(data) ? data.map(normalizeComment) : [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

export async function addComment({ postId, authorId, name, avatar, text }) {
  const payload = {
    postId: String(postId),
    authorId: String(authorId),
    name,
    avatar: avatar || '',
    text,
    createdAt: new Date().toISOString(),
  };

  try {
    return normalizeComment(await request('/comments', { method: 'POST', body: payload }));
  } catch (error) {
    if (error.status === 404) {
      throw new Error("Izohlar resursi (/comments) mockAPI'da hali yaratilmagan.");
    }
    throw error;
  }
}

export async function deleteComment(id) {
  await request(`/comments/${id}`, { method: 'DELETE' });
  return true;
}
