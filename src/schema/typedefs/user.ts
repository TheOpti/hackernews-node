export const userTypedef = `
  type User {
    id: IntID!
    name: String!
    email: String
    links: [Link]
    comments: [Comment]
    votes: [Vote]
    bio: String
    createdAt: DateTime!
    updatedAt: DateTime
  }
`;
