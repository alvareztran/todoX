import AddTask from "@/components/AddTask";
import DateTimeFilters from "@/components/DateTimeFilters";
import StatisticsAndFilters from "@/components/StatisticsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [queryDate, setQueryDate] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTasks();
  }, [queryDate]);

  useEffect(() => {
    setPage(1);
  }, [filter, queryDate]);

  const getTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${queryDate}`);
      console.log(res.data);
      setTasks(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompletedTaskCount(res.data.completedCount);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi xảy ra khi truy xuất tasks.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });

  const handleTaskChanged = () => {
    getTasks();
  };

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit,
  );
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  if (visibleTasks.length === 0) {
    handlePrevPage();
  }

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          <StatisticsAndFilters
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
            filter={filter}
            setFilter={setFilter}
          />
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />
          <div className="flex flex-col justify-between items-center gap-6 sm:flex-row">
            <TaskListPagination
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handleChangePage={handleChangePage}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilters
              queryDate={queryDate}
              setQueryDate={setQueryDate}
            />
          </div>
          <Footer
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
