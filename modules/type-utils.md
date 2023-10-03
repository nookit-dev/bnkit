# Type Utils

## KeyValArrExtract
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


## UnboxArray

```typescript
const test = [10, 'test']

type Test = UnboxArray<typeof test>
```


## IfFunction

```typescript
const exampleFn = (a: number, b: number) => a + b;

type ExampleFnType = IfFunction<typeof exampleFn>; // number

const exampleObj = {
  key1: 'testValue',
  key: 10
}

type ExampleObjType = IfFunction<typeof exampleObj>; // { key1: string, key2: number }
```