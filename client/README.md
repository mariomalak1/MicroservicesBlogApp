# Microservices Blog Client

Run the frontend for the Microservices Blog.

Assumptions:
- Posts service: `http://localhost:4001/posts-create`
- Comments service: `http://localhost:4002/posts/:postTitle/comments`
- Query service: `http://localhost:4003/` (returns `{ posts }`)

Install and run:

```bash
cd client
npm install
npm run dev
```

If browser CORS issues occur, either enable CORS in the backend services or run a local proxy so the frontend can reach the microservices.
