
export const feed = async (parent: any, args: any, context: any) => {
  const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } },
      ],
    }
    : {};

  const links = await context.prisma.link.findMany({
    where,
  });

  return links;
};
