import SidebarToggleButton from './SidebarToggleButton';

const DashboardTopPanel = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-x-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <SidebarToggleButton />
    </div>
  );
};

export default DashboardTopPanel;
