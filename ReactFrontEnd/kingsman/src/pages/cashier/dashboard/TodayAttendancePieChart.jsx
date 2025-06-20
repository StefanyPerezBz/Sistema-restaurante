import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function TodayAttendancePieChart() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 6, label: 'Present' },
            { id: 1, value: 2, label: 'Absent' },
            
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}