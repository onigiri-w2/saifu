import { TransactionCategoryType } from '@/src/domain/model/aggregation/transactionCategory';
import { IconColor } from '@/src/domain/model/types/categoryIconColor';
import { IconName } from '@/src/domain/model/types/categoryIconName';

// リクエスト型の定義
export type CreateRequest = {
  category: WithType<CategoryBase>;
};

export type UpdateRequest = {
  category: WithId<CategoryBase>;
};

// 共通の基本型定義
export type CategoryBase = {
  name: string;
  iconName: IconName;
  iconColor: IconColor;
};

// ID付きの拡張型
export type WithId<T> = T & {
  id: string;
};

export type WithType<T> = T & {
  type: TransactionCategoryType;
};
