type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type CamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K] extends Array<infer U>
    ? Array<CamelCase<U>>
    : T[K] extends object
    ? CamelCase<T[K]>
    : T[K];
};

export function toCamelCase<T>(obj: T): CamelCase<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item)) as any;
  }

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
  }
  return result;
}