# hackernews-node

Tutorial from https://www.howtographql.com/ - backend application written in node.js with Typescript.
Provides an hackernews-like application.

How to work with the app:

1. Install all dependencies with `npm install`
1. Install Prisma, create a database (empty): `npx prisma migrate dev --name "init"`
1. Generate example data by running `npx prisma db seed`
1. Start server - `npm start`. Server is available on `localhost:4000`.

### Queries

Limit and offset have different names in the Prisma API:

- The limit is called `take`, meaning we take `x` elements after a provided start index.
- The start index is called `skip`, since wwe skip that many elements in the list.

###

```graphql
# Query to list all links (and without any parameters):
query {
  feed {
    id
    description
    url
  }
}

# Query with filter and pagination:
query {
  feed(filter: "casc", skip: 0, take: 10) {
    id
    description
    url
  }
}

# Mutation to add new link:
mutation {
  addLink(url: "www.prisma.io", description: "Prisma replaces traditional ORMs") {
    id
  }
}

# Mutation to update link:
mutation {
  updateLink(id: "link-1", url: "dsadsadsa")
}

# Mutation to remove link:
mutation {
  deleteLink(id: "link-3")
}
```

### Queries - Usage with authentication

```graphql
# Register new user and retrieve token
mutation {
  signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
    token
    user {
      id
    }
  }
}

# Create new link as a newly registered user (remember to include token in auth header)
mutation {
  addLink(url: "www.graphqlconf.org", description: "An awesome GraphQL conference") {
    id
  }
}

# Get list of all links with authors
query {
  feed {
    id
    description
    url
    postedBy {
      id
      email
    }
  }
}

# Subscribing
subscription {
  newLink {
    id
    url
    description
    postedBy {
      id
      name
      email
    }
  }
}
```

## Notes about GraphQL

### GraphQL Schemas

Every GraphQL schema has three special root types: `Query`, `Mutation`, and `Subscription`.
The root types correspond to the three operation types offered by GraphQL: queries, mutations, and subscriptions.

- `Query` - used by the client to request the data it needs from the server.

- `Mutation` - used to create new data, update existing data and delete data.
  The syntax for mutations look almost the same as queries, but they must start with the mutation keyword.

- `Subscription` - are a way to create and maintain real time connection to the server.
  This enables the client to get immediate information about related events.
  Basically, a client subscribes to an event in the server, and whenever that event is
  called, the server will send the corresponding data to the client.

### Subscriptions

In addition to queries and mutations, GraphQL supports a third operation type: subscriptions.

Subscriptions are a GraphQL feature that allows a server to send data to its clients when a
specific event happens. Subscriptions are usually implemented with WebSockets.

In that setup, the server maintains a steady connection to its subscribed client.

Subscriptions:

- Like queries, subscriptions enable you to fetch data.
- Unlike queries, subscriptions are long-lasting operations that can change their result
  over time. They can maintain an active connection to your GraphQL server (most commonly via WebSocket), enabling the server to push updates to the subscription's result.
