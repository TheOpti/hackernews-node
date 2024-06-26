export const linkTypedef = `
  type Link {
    id: IntID!
    description: String!
    url: String!
    postedBy: User
    votes: [Vote!]
  }
`;
