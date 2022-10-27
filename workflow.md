# Worfklow

## Steps

This file includes all steps necessary to test the whole workflow, in order to create some users,
add links and do some voting stuff for the very beginning.

## Users

Create some users:

```graphql
# Create first user
mutation {
  signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
    token
  }
}

# Create second
mutation {
  signup(name: "Bob", email: "bob@prisma.io", password: "graphql") {
    token
  }
}

# Create last one
mutation {
  signup(name: "Tom", email: "tom@prisma.io", password: "graphql") {
    token
  }
}
```

## Links

Add some links as users:
```graphql
# Token for first user:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY2Njg5ODc4M30.h6g6HpSbufEbLBcanD5ECziPx1v5ofxc_tNaqYdglWA

# Token for second user:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY2Njg5ODgxNH0.D8ksPsfb6CYEM8QdspXp58KNhufuasH62TeYf75_EWA

# Token for third user:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY2Njg5ODg5NX0.B7vbdtEXQK9dsQOebUBMV0H5sSYWLxg8hYkVflDb0Bo

mutation {
  addLink(url: "www.graphqlconf.org", description: "An awesome GraphQL conference") {
    id
  }
}

mutation {
  addLink(url: "https://css-tricks.com/", description: "CSS-Tricks - Tips, Tricks, and Techniques on using Cascading Style Sheets.") {
    id
  }
}

mutation {
  addLink(url: "https://frontendmasters.com/", description: "Frontend Masters — Learn JavaScript, React, Vue & Angular from Masters of Front-End Development!") {
    id
  }
}

# Get all queries:
query {
  feed { id, description, url, postedBy { id, name, email, links { id, url } }, votes { id } }
}

# This should return 3 links, all created by user with ID = 3 (Alice) and votes set to null
```

## Votes

Add some votes for links and check if we can vote again for a single link:
```graphql
# Vote as first user for all links:

# Vote as second for only first link:
# Vote as third for first link:
```
