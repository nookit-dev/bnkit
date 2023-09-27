# Type Utils

```typescript
const statsFromApiConst = [
    { testKey: "beanz" },
    { testKey: "" },
    { testKey: "popcorn" },
    { testKey: "guitar" },
    { testKey: "banana" },
    { testKey: "drums" },
  ] as const;

// usage:
type TestKey = KeyValArrExtract<typeof statsFromApiConst, "testKey">;
```


