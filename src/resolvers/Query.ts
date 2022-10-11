
export const feed = async (parent: any, args: any, context: any) => {
  console.log('inside feed');
  return context.prisma.link.findMany();
};
