export function useStorage<T>(key: string) {
  const get = (): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const set = (data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const add = (item: T): void => {
    const data = get();
    data.push(item);
    set(data);
  };

  const update = (id: string, updates: Partial<T>): void => {
    const data = get();
    const index = data.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      set(data);
    }
  };

  const remove = (id: string): void => {
    const data = get();
    const filtered = data.filter((item: any) => item.id !== id);
    set(filtered);
  };

  const findById = (id: string): T | undefined => {
    const data = get();
    return data.find((item: any) => item.id === id);
  };

  const find = (predicate: (item: T) => boolean): T | undefined => {
    const data = get();
    return data.find(predicate);
  };

  const filter = (predicate: (item: T) => boolean): T[] => {
    const data = get();
    return data.filter(predicate);
  };

  return {
    get,
    set,
    add,
    update,
    remove,
    findById,
    find,
    filter,
  };
}

export function useSingleStorage<T>(key: string) {
  const get = (): T | null => {
    const data = localStorage.getItem(key);
    if (data === null) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  const set = (data: T | null): void => {
    if (data === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  return { get, set };
}
