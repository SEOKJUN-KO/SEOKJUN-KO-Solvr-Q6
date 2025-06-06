import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, ClockCircleOutlined, LineChartOutlined, RobotOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      style={{ marginBottom: '20px' }}
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">홈</Link>
      </Menu.Item>
      <Menu.Item key="/sleep" icon={<ClockCircleOutlined />}>
        <Link to="/sleep">수면 기록</Link>
      </Menu.Item>
      <Menu.Item key="/analysis" icon={<LineChartOutlined />}>
        <Link to="/analysis">수면 분석</Link>
      </Menu.Item>
      <Menu.Item key="/ai-analysis" icon={<RobotOutlined />}>
        <Link to="/ai-analysis">AI 수면 진단</Link>
      </Menu.Item>
    </Menu>
  );
}; 