
export const links = (parent: any, args: any, context: any) => {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .links();
}
