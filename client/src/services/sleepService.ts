import axios from 'axios';
import { SleepRecord, NewSleepRecord, UpdateSleepRecord } from '../types/sleep';

const API_URL = 'http://localhost:3000/api';

export const sleepService = {
  // 수면 기록 생성
  createRecord: async (record: NewSleepRecord): Promise<SleepRecord> => {
    const response = await axios.post(`${API_URL}/sleep`, record);
    return response.data;
  },

  // 수면 기록 목록 조회
  getRecords: async (userId: string, startDate?: Date, endDate?: Date): Promise<SleepRecord[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await axios.get(`${API_URL}/sleep/${userId}?${params.toString()}`);
    return response.data;
  },

  // 수면 기록 수정
  updateRecord: async (id: number, record: UpdateSleepRecord): Promise<SleepRecord> => {
    const response = await axios.put(`${API_URL}/sleep/${id}`, record);
    return response.data;
  },

  // 수면 기록 삭제
  deleteRecord: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/sleep/${id}`);
  },
}; 