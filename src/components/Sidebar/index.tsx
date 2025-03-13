import { Menu } from 'antd';
import { 
  AppstoreOutlined, 
  UserOutlined, 
  SafetyCertificateOutlined,
  SecurityScanOutlined 
} from '@ant-design/icons';
import './styles.scss';

const menuItems = [
  {
    key: 'strategies',
    icon: <AppstoreOutlined />,
    label: 'Strategies',
  },
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile',
    disabled: true,
  },
  {
    key: 'assessments',
    icon: <SafetyCertificateOutlined />,
    label: 'Assessments',
    disabled: true,
  },
  {
    key: 'security',
    icon: <SecurityScanOutlined />,
    label: 'Security',
    disabled: true,
  }
];

export function Sidebar() {
  return (
    <div className="app-sidebar">
      <Menu
        mode="inline"
        defaultSelectedKeys={['strategies']}
        items={menuItems}
        className="app-sidebar__menu"
      />
    </div>
  );
}
