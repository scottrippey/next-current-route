# `next-current-route`
React Hook for reading / writing values to the URL in a NextJS appliication.

This is perfect for features such as deep-linking. 

Install via `npm install --save next-current-route`

# API

## useRouteState

This is a replacement for React's `useState`. It reads and writes a value to the current NextJS route.

### Example
```tsx
// pages/example/[id].tsx
import { useRouteState } from 'next-current-route';

type ExampleRoute = { id: string, search?: string };

function Example() {
  const [ id, setId ] = useRouteState<ExampleRoute>("id");
  const [ search, setSearch ] = useRouteState<ExampleRoute>("search");
  return <div>
    Search:
    <input 
      value={search} 
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>;
}
```

### Usage
```tsx
const [ value, setValue ] = useRouteState<TQuery>(key, method?);
```

- `key: string` - The name of the query parameter
- `method?: 'replace' (default) | 'push' | 'url'` 
    - `'replace'` (default) - Replaces the current URL with the new one (does not add to history)
    - `'push'` - Pushes the new URL to history
    - `'url'` - Simply returns a new URL object, which can be used with `next/link`. Example: 
      ```tsx
      <Link href={setValue('foo', 'url')} passHref>
        <a> Link </a>
      </Link>
      ```
- `value: string` - The value from the current route
- `setValue: string` - Sets the value on the current route
- `TQuery` (optional) - Provides a more specific data type than `string`.
    ```tsx
    type TabRoute = { tab?: 'one' | 'two' | 'three' };
    const [ tab, setTab ] = useRouteState<TabRoute>("tab");
    // tab: undefined | 'one' | 'two' | 'three';
    ```

## useCurrentRoute

This hook is just like `useRouteState`, but supports reading and writing of **multiple parameters** at the same time.

### Example
```tsx
// pages/example/[id].tsx
type ExampleRouteParams = { id: string, search?: string };

const ExamplePage = () => {
    const [ query, route ] = useCurrentRoute<ExampleRouteParams>();
    
    return <div>
      <h1> Features </h1>
      <p> 
        Read strongly-typed values from the current route:
        ID: { query.id } Search: { query.search }
      </p>
      <p>
        Write strongly-typed values to the current route:
        <input onChange={(e) => route.replace({ search: e.target.value })} />
        (replaces the current URL with "example/id?search=...")
        
        <button onClick={() => route.replace({ search: undefined })}> 
          Clear Search
          (sets the URL back to "example/id")
        </button>
      </p>
      <p>
        Works great with "next/link" too:
        <Link href={route.url({ id: '123' })} passHref>
          <a> Go to "example/123" </a> 
        </Link>
      </p>
    </div>;
}
```
