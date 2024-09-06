export const applyCustomDecorators =
  (decorators) =>
  (target: any, key: string, descriptor: PropertyDescriptor) => {
    decorators.forEach((decorator) => decorator(target, key, descriptor));
  };
