export interface Hashable {
  hash(): string;
}

export class HashMap<K extends Hashable, V> {
  protected map = new Map<string, V>();

  constructor(entries?: Iterable<[K, V]>);
  constructor(map: HashMap<K, V>);

  constructor(entries?: Iterable<[K, V]> | HashMap<K, V>) {
    if (entries instanceof HashMap) {
      this.map = new Map(entries.map);
      return;
    }

    this.map = new Map();
    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  set(key: K, value: V): this {
    const hash = key.hash();
    this.map.set(hash, value);
    return this;
  }

  get(key: K): V | undefined {
    const hash = key.hash();
    return this.map.get(hash);
  }

  has(key: K): boolean {
    const hash = key.hash();
    return this.map.has(hash);
  }

  delete(key: K): boolean {
    const hash = key.hash();
    return this.map.delete(hash);
  }

  values(): IterableIterator<V> {
    return this.map.values();
  }
  strKeys(): IterableIterator<string> {
    return this.map.keys();
  }

  clear(): void {
    this.map.clear();
  }

  entries(): IterableIterator<[string, V]> {
    return this.map.entries();
  }

  get size(): number {
    return this.map.size;
  }

  forEach(callbackfn: (value: V, key: K, map: HashMap<K, V>) => void): void {
    this.map.forEach((value, hash) => {
      // Note: This is a simplified approach. In a real-world scenario,
      // you might want to store the original keys alongside their hashes.
      callbackfn(value, { hash: () => hash } as K, this);
    });
  }
}
