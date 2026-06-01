import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Calendar } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title || "");

  const updateTask = async () => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`, {
        title: newTitle,
      });
      toast.success("Cập nhật nhiệm vụ thành công.");
      handleTaskChanged();
    } catch (err) {
      console.log("Đã xảy ra lỗi khi cập nhật nhiệm vụ: ", err);
      toast.error("Đã xảy ra lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const deleteTask = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Nhiệm vụ đã được xóa thành công.");
      handleTaskChanged();
    } catch (err) {
      console.log("Đã xảy ra lỗi khi xóa nhiệm vụ: ", err);
      toast.error("Đã xảy ra lỗi khi xóa nhiệm vụ.");
    }
  };

  const markCompletedTask = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "completed",
          completedAt: new Date().toISOString(),
        });
        toast.success(`${task.title} đã hoàn thành.`);
        handleTaskChanged();
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null,
        });
        toast.success(`${task.title} đã được chuyển sang trạng thái đang làm.`);
        handleTaskChanged();
      }
    } catch (err) {
      console.log("Đã xảy ra lỗi khi cập nhật trạng thái nhiệm vụ: ", err);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTask();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-prmary",
          )}
          onClick={markCompletedTask}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0 ">
          {isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditting(false);
                setNewTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {task.title}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors text-muted-foreground size-8 hover:text-info"
            onClick={() => {
              setIsEditting(true);
              setNewTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors text-muted-foreground size-8 hover:text-destructive"
            onClick={() => deleteTask()}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
