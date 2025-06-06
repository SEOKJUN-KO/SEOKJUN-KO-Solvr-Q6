import { makeAutoObservable, action } from 'mobx';
import { sleepService } from '../services/sleepService';
import { SleepRecord, NewSleepRecord, UpdateSleepRecord } from '../types/sleep';

export class SleepViewModel {
  records: SleepRecord[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      setLoading: action,
      setError: action,
      setRecords: action,
      addRecord: action,
      updateRecordInList: action,
      removeRecord: action,
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setRecords(records: SleepRecord[]) {
    this.records = records;
  }

  addRecord(record: SleepRecord) {
    this.records.push(record);
  }

  updateRecordInList(id: number, record: SleepRecord) {
    const index = this.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.records[index] = record;
    }
  }

  removeRecord(id: number) {
    this.records = this.records.filter(r => r.id !== id);
  }

  // 수면 기록 생성
  async createRecord(record: NewSleepRecord) {
    try {
      this.setLoading(true);
      this.setError(null);
      const newRecord = await sleepService.createRecord(record);
      this.addRecord(newRecord);
    } catch (error) {
      this.setError('수면 기록 생성에 실패했습니다.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // 수면 기록 목록 조회
  async loadRecords(userId: string, startDate?: Date, endDate?: Date) {
    try {
      this.setLoading(true);
      this.setError(null);
      const records = await sleepService.getRecords(userId, startDate, endDate);
      this.setRecords(records);
    } catch (error) {
      this.setError('수면 기록 조회에 실패했습니다.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // 수면 기록 수정
  async updateRecord(id: number, record: UpdateSleepRecord) {
    try {
      this.setLoading(true);
      this.setError(null);
      const updatedRecord = await sleepService.updateRecord(id, record);
      this.updateRecordInList(id, updatedRecord);
    } catch (error) {
      this.setError('수면 기록 수정에 실패했습니다.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // 수면 기록 삭제
  async deleteRecord(id: number) {
    try {
      this.setLoading(true);
      this.setError(null);
      await sleepService.deleteRecord(id);
      this.removeRecord(id);
    } catch (error) {
      this.setError('수면 기록 삭제에 실패했습니다.');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
} 