import type { IBlogArticle } from "../../models/BlogArticle";
import { toPlainSerializedValue } from "./plain";

export function serializeBlogArticle(article: IBlogArticle) {
  const data = article.toObject ? article.toObject() : article;
  const publicArticle = data as Record<string, unknown>;

  return toPlainSerializedValue({
    ...publicArticle,
    imageUrl:
      publicArticle.coverImage && typeof publicArticle.coverImage === "object"
        ? (publicArticle.coverImage as { url?: string }).url || ""
        : "",
    readTime: publicArticle.estimatedReadingMinutes || publicArticle.readingTime,
  });
}
