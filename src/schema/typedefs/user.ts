export const userTypedef = `
  type User {
    id: IntID!
    name: String!
    email: String!
    links: [Link!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
