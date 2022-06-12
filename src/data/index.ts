
let links = [
  {
    id: 'link-1',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  },
  {
    id: 'link-2',
    url: 'https://css-tricks.com/',
    description: 'Website with tips and tricks related to CSS'
  },
  {
    id: 'link-3',
    url: 'https://www.smashingmagazine.com/',
    description: 'Frontend development knowledge center'
  }
];

const removeLink = (linkId: string) => {
  links = links.filter((link) => link.id !== linkId);
}

const updateLink = (linkId: string, url?: string, description?: string) => {
  const linkToUpdateIdx = links.findIndex((link) => link.id !== linkId);

  links = [
    ...links.slice(0, linkToUpdateIdx),
    {
      ...links[linkToUpdateIdx],
      ...( url && { url }),
      ...( description && { description })
    },
    ...links.slice(linkToUpdateIdx + 1, links.length),
  ];
};

export { links, removeLink, updateLink };
