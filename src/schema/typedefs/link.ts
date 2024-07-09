export const linkTypedef = `
  type Link {
    id: IntID!
    title: String!
    description: String
    url: String!
    postedBy: User
    comments: [Comment!]
    votes: [Vote!]
    numberOfComments: Int
    numberOfVotes: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
