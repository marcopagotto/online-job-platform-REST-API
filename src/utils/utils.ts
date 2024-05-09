export const generateRandomEmail = (): string => {
  const username = Math.random().toString(36).substring(2, 7);
  const domain = Math.random() > 0.5 ? 'example.com' : 'test.com';
  return `${username}@${domain}`;
};
