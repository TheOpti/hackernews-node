export const links = (parent: any, args: any, context: any) => {
  return context.prisma.link.findMany({ where: { postedById: parent.id } });
};
