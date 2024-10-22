export const enumToArray = <T extends string | number>(enumme: {
  [key: string]: T;
}): T[] => {
  return Object.values(enumme) as T[];
};
