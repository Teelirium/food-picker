const optionFinder = (options: any, value: string | number | null): any => {
  if (!options) return null;
  for (const c of options) {
    if (!c.options) {
      if (c.value === value) return c;
    }
    const foundOption = optionFinder(c.options, value);
    if (foundOption) return foundOption;
  }
  return null;
};

export default optionFinder;
