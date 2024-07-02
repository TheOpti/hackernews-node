export const commentTypedef = `
  type Comment {
    id: IntID!
    content: String!
    author: User
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
