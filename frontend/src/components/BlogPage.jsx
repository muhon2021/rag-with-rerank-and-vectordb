import { BookOpen } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="blog-wrap">
      <header className="blog-header">
        <div className="blog-title">
          <BookOpen size={18} className="blog-icon" />
          <h1>Blog</h1>
        </div>
        <p className="blog-subtitle">Product updates, tips, and deep-dives into RAG techniques.</p>
      </header>

      <section className="blog-list">
        <article className="blog-post">
          <h2 className="blog-post-title">Cutting RAG latency by 50%: practical steps</h2>
          <p className="blog-post-excerpt">
            Learn how batching, streaming, and smarter chunking reduce end-to-end latency without sacrificing answer quality.
          </p>
          <div className="blog-post-meta">September 15, 2026 • 6 min read</div>
        </article>

        <article className="blog-post">
          <h2 className="blog-post-title">When to use hybrid search vs. reranking</h2>
          <p className="blog-post-excerpt">
            Choosing the right retrieval approach based on corpus characteristics and user intent.
          </p>
          <div className="blog-post-meta">September 1, 2026 • 5 min read</div>
        </article>

        <article className="blog-post">
          <h2 className="blog-post-title">Operationalizing ingest: checklists and alerts</h2>
          <p className="blog-post-excerpt">
            Build confidence in your pipelines with repeatable ingest and meaningful monitoring.
          </p>
          <div className="blog-post-meta">August 22, 2026 • 4 min read</div>
        </article>
      </section>
    </div>
  );
}
