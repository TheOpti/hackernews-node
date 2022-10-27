
export const postedBy = (parent: any, args: any, context: any) => {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .postedBy();
};

export const votes = (parent: any, _: any, context: any) => {
  console.debug('inside votes() ');
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
};
