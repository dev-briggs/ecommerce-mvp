declare global {
  type PickByValue<T, V> = Pick<
    T,
    { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
  >;

  /**
   * When you want to pair each key with something dependent on that key's type, use a mapped type
   * https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
   */
  type Entries<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

  /**
   * An alternative solution using a distributive conditional type: this requires K to be a "naked type parameter", hence the extra optional generic parameter.
   * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
   */
  type Entries2<T, K extends keyof T = keyof T> = (K extends unknown
    ? [K, T[K]]
    : never)[];

  /**
   * https://stackoverflow.com/a/60142095
   */
  type Entries3<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]];
  }[keyof T][];

  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>;
  }
}
