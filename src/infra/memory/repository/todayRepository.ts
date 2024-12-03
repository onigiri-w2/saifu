import ITodayRepository from '@/src/domain/aggregation/today/repository.type';
import LocalDate from '@/src/domain/valueobject/localdate';
import Today from '@/src/domain/aggregation/today';

class MemoryTodayRepository implements ITodayRepository {
  private today: Today;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.today = this.createToday();
    this.setTomorrowTimer();
  }

  getToday(): Today {
    return this.today;
  }

  private createToday(): Today {
    return Today.build(LocalDate.fromDate(new Date()));
  }

  private setTomorrowTimer() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilTomorrow = tomorrow.getTime() - now.getTime();

    this.timeoutId = setTimeout(() => {
      this.today = this.createToday();
      this.setTomorrowTimer();
    }, timeUntilTomorrow + 1000); // 1秒のバッファを追加
  }

  // クリーンアップのためのメソッド
  public clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export default MemoryTodayRepository;
