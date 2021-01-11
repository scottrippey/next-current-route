# `next-current-route`
React Hook for strongly-typed access to the current NextJS route, and for pushing strongly-typed changes

# API

Use the hook as follows:

```tsx
// pages/example/[id]/index.tsx
type ExampleRouteParams = { id: string, search?: string };

const ExamplePage = () => {
    const [ query, route ] = useCurrentRoute<ExampleRouteParams>();
    
    return (<div>
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
    </div>);
}
```
