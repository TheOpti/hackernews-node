# TODO List

## Authentication & Security
- [ ] Add validation for registration fields in `signup` mutation.
- [ ] Send email with confirmation link during registration.
- [ ] Rethink registration flow: clarify which tokens should be returned.
- [ ] Avoid storing password salt in the database; use bcrypt's built-in salt management.
- [ ] Fail fast if JWT secrets are missing in environment variables.
- [ ] Rotate refresh tokens and invalidate old ones for improved security.

## Error Handling
- [ ] Replace generic error messages with structured GraphQL error responses.
- [ ] Use GraphQL error extensions for more informative error handling.

## Code Quality
- [ ] Fix `addLink` mutation to set `title` from the correct field, not `description`.
- [ ] Remove usage of `any` types, especially in JWT-related functions.
- [ ] Await `context.prisma.vote.create` in `vote` mutation before publishing the event.

## GraphQL Schema
- [ ] Add resolver for custom scalar `IntID`.
- [ ] Ensure consistent logic for exposing sensitive fields (e.g., `email`) across all resolvers.

## Testing
- [ ] Add unit and integration tests for authentication, mutations, and queries.

## Documentation
- [ ] Expand `README.md` with environment setup, running tests, and contributing guidelines.

## Environment & Performance
- [ ] Add validation for required environment variables at startup.
- [ ] Use Prisma's transaction support for multi-step mutations if needed.
- [ ] Consider connection pooling for Prisma
