import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [title, setTitle] = useState("");

  const addTask = async () => {
    if (title.trim()) {
      try {
        await api.post("/tasks", {
          title,
        });
        toast.success(`Nhiệm vụ ${title} đã được thêm thành công.`);
        handleNewTaskAdded();
      } catch (err) {
        console.log(err);
        toast.error("Lỗi xảy ra khi thêm mới nhiệm vụ.");
      }
      setTitle('');
    } else {
      toast.error("Bạn cần nhập thông tin nhiệm vụ trước.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  }

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="gradient" size="xl" className="px-6" onClick={addTask} disabled={!title.trim()}>
          <Plus className="size-5" />
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
