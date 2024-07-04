export const meTypedef = `
  type LoggedUser {
    id: IntID!
    name: String!
    email: String!
    links: [Link]
    comments: [Comment]
    votes: [Vote]
    bio: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
