import { DomainValidationError } from '../error';
import BudgetPlan from '../model/aggregation/budgetPlan';
import IBudgetPlanRepository from '../model/aggregation/budgetPlan/repository.type';
import ITransactionCategoryRepository from '../model/aggregation/transactionCategory/repository.type';

class BudgetPlanService {
  constructor(private readonly budgetPlanRepository: IBudgetPlanRepository) {}

  /**
   * Note
   *   - 重複チェック と save の間で本来はトランザクション張るべき
   *   - ただ、本アプリの特性上、重複チェックとsaveの間で別budgetPlanが追加されることはない
   *   - なので今はこのままでいいが、今後の設計時など場合によっては必要になると覚えておく
   *   - トランザクション（悲観ロック） or 保存した後に再度重複チェック（楽観ロック）など
   * */
  async save(budgetPlan: BudgetPlan) {
    await this.checkDuplicateOfCategoryId(budgetPlan);
    await this.budgetPlanRepository.save(budgetPlan);
    return budgetPlan;
  }

  /** categoryId が重複してないかチェックする */
  async checkDuplicateOfCategoryId(budgetPlan: BudgetPlan) {
    const targetCategoryIds = new Set(budgetPlan.categoryIds.map((c) => c.value));
    const otherBudgetPlans = (await this.budgetPlanRepository.findAll()).filter(
      (bp) => bp.id.value !== budgetPlan.id.value,
    );

    otherBudgetPlans.forEach((bp) => {
      const intersection = bp.categoryIds.filter((c) => targetCategoryIds.has(c.value));
      if (intersection.length > 0) {
        throw new DomainValidationError('カテゴリが重複しています', {
          context: {
            duplicatedCategoris: intersection.map((c) => c.value),
          },
        });
      }
    });
  }

  async loadValidBudgetPlans(categoryRepo: ITransactionCategoryRepository) {
    const [budgetPlans, categories] = await Promise.all([
      this.budgetPlanRepository.findAll(),
      categoryRepo.findAll('expenseCategory'),
    ]);
    const expenseCategories = categories.filter((c) => c.type === 'expenseCategory');

    const validPlans = [];
    for (const plan of budgetPlans) {
      const validCategoryIds = plan.categoryIds.filter((c) => expenseCategories.some((ec) => ec.id.value === c.value));
      if (validCategoryIds.length > 0) {
        validPlans.push(BudgetPlan.build(plan.id, validCategoryIds, plan.strategy));
      }
    }

    return validPlans;
  }
}

export default BudgetPlanService;
