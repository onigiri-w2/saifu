import Category from '.';

interface ICategoryRepository {
  save: (entity: Category) => Promise<void>;
  remove: (id: string) => Promise<void>;
  find: (id: string) => Promise<Category | undefined>;
  findAll: () => Promise<Category[]>;
}

export default ICategoryRepository;
