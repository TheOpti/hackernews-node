export const linkTypedef = `
  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User
    votes: [Vote!]
  }
`;
