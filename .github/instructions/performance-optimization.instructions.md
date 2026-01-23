---
applyTo: '*'
description: 'Performance optimization best practices for all languages and frameworks'
---

# Performance Optimization Best Practices

## Core Principles

- **Measure First:** Always profile before optimizing; use benchmarks and monitoring tools
- **Optimize Common Cases:** Focus on frequently executed code paths
- **Avoid Premature Optimization:** Write clear code first; optimize when necessary
- **Minimize Resources:** Use memory, CPU, network, and disk efficiently
- **Set Performance Budgets:** Define and enforce acceptable limits

## Frontend Performance

### Rendering & DOM
- Minimize DOM manipulations; batch updates
- Use virtual DOM frameworks efficiently (React.memo, useMemo, useCallback)
- Use stable keys in lists
- Prefer CSS animations over JavaScript

### Assets
- Compress images; use WebP/AVIF formats
- Minify and bundle JS/CSS; enable tree-shaking
- Use lazy loading: `loading="lazy"` for images
- Set long-lived cache headers with cache busting
- Subset and optimize fonts

### Network
- Reduce HTTP requests; combine files
- Enable HTTP/2 or HTTP/3
- Use CDNs for static assets
- Implement service workers for offline caching
- Use `defer`/`async` for scripts
- Preload/prefetch critical resources

### JavaScript
- Offload heavy work to Web Workers
- Debounce/throttle high-frequency events
- Clean up event listeners to prevent memory leaks
- Use efficient data structures (Map/Set)
- Avoid deep object cloning

### Framework-Specific
**React:**
- Use React.memo, useMemo, useCallback
- Code-splitting with React.lazy and Suspense
- Profile with React DevTools

**Vue:**
- Use computed properties for caching
- Use `v-show` vs `v-if` appropriately
- Lazy load routes

## Backend Performance

### Algorithms & Data Structures
- Choose appropriate data structures
- Avoid O(n²) or worse complexity
- Use efficient algorithms (binary search, hash-based)
- Process data in batches or streams

### Concurrency
- Use async/await for I/O operations
- Use thread/worker pools appropriately
- Avoid race conditions with proper locking
- Implement backpressure in queues

### Caching
- Cache expensive computations (Redis, Memcached)
- Use appropriate TTL for cache invalidation
- Protect against cache stampede
- Monitor cache hit/miss ratios

### API & Network
- Minimize payload sizes; use compression
- Implement pagination for large results
- Use connection pooling
- Consider HTTP/2, gRPC, or WebSockets

### Language-Specific
**C#/.NET:**
- Use async/await for I/O
- Use `Span<T>` and `Memory<T>` for efficient memory
- Pool objects and connections
- Profile with dotTrace or PerfView

**Node.js:**
- Never block the event loop
- Use streams for large data
- Enable clustering for CPU-bound tasks
- Profile with clinic.js

**Python:**
- Use built-in data structures
- Use `asyncio` or `multiprocessing`
- Profile with cProfile or Py-Spy
- Use lru_cache for memoization

## Database Performance

### Query Optimization
- Create indexes on frequently queried columns
- Avoid `SELECT *`; select only needed columns
- Use parameterized queries
- Analyze query execution plans
- Avoid N+1 queries; use joins or batch queries
- Implement pagination with LIMIT/OFFSET

### Schema Design
- Normalize to reduce redundancy; denormalize for read-heavy workloads
- Use efficient data types
- Partition large tables
- Archive old data regularly

### Transactions
- Keep transactions short to reduce lock contention
- Use appropriate isolation levels
- Avoid long-running transactions

### Caching & Replication
- Use read replicas for scaling reads
- Cache frequent queries (Redis/Memcached)
- Monitor replication lag
- Implement sharding for scalability

## Code Review Performance Checklist

- [ ] Efficient algorithms (no O(n²) in hot paths)
- [ ] Appropriate data structures
- [ ] Caching used where beneficial
- [ ] Database queries optimized and indexed
- [ ] Large data sets paginated or streamed
- [ ] No memory leaks or unbounded resource usage
- [ ] Network requests minimized and batched
- [ ] Assets optimized and compressed
- [ ] No blocking operations in hot paths
- [ ] Performance-critical code documented

## Monitoring & Testing

- Profile applications regularly (Chrome DevTools, Application Insights)
- Write benchmarks for critical code paths
- Monitor Core Web Vitals (LCP, FID, CLS)
- Use Lighthouse for frontend audits
- Integrate performance tests in CI/CD
- Set up alerts for performance regressions

## Common Anti-Patterns

- Loading large JS bundles on initial load
- Not compressing images
- SELECT * in production queries
- Missing database indexes
- Synchronous I/O in web servers
- Not using connection pooling
- Over-caching or caching volatile data
- Ignoring memory leaks
