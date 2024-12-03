import Today from '@/src/domain/aggregation/today';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';

export const loadToday = async (): Promise<Today> => {
  const repoToday = RepositoryRegistry.getInstance().todayRepository;
  return new Promise<Today>((resolve) => {
    setTimeout(() => {
      resolve(repoToday.getToday());
    }, 0);
  });
};
