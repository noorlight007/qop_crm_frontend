import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import MyTasks from "@/Components/Common/MyTasks/MyTasks";

const TasksContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Tasks Overview"
        subTitle="This is the tasks overview page."
        parent="Cases"
        child="Tasks"
      />
      <MyTasks />
    </div>
  );
};

export default TasksContainer;
