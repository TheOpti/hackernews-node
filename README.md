# hackernews-node
Tutorial from https://www.howtographql.com/ - backend with node.js

Start server - `npm start`. Server is available on `localhost:4000`.

### Queries

###
```graphql
# Query to list all links:
query {
  feed { id, description, url }
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

#### Creating new user



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
  feed { id, description, url, postedBy { id, email }  }
}
```

## Notes about GraphQL

### GraphQL Schemas

Every GraphQL schema has three special root types: `Query`, `Mutation`, and `Subscription`.
The root types correspond to the three operation types offered by GraphQL: queries, mutations, and subscriptions.

* `Query` - used by the client to request the data it needs from the server.

* `Mutation` - used to create new data, update existing data and delete data.
  The syntax for mutations look almost the same as queries, but they must start with the mutation keyword.

* `Subscription` - are a way to create and maintain real time connection to the server.
This enables the client to get immediate information about related events.
Basically, a client subscribes to an event in the server, and whenever that event is
called, the server will send the corresponding data to the client.
