To use this module, first import it:

```typescript
import { createFetcher } from "fetcher";
```

Then create an instance of `createFetcher` with the `baseUrl` option:

```typescript
const fetcher = createFetcher({ baseUrl: "https://api.example.com" });
```

You can then use the `get`, `post`, and `getStatus` methods to make requests:

```typescript
interface Post {
  id: number;
  title: string;
  body: string;
}

// get example
const post = await fetcher.get<Post>("/posts/1");
console.log(post.title); // "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"

// post example
const newPost = await fetcher.post<Post>({
  endpoint: "/posts",
  params: { title: "foo", body: "bar", userId: 1 },
});
console.log(newPost.id); // 101

// getStatus example
const status = await fetcher.getStatus("/posts/1");
console.log(status); // "OK"
```