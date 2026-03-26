import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus } from "./tasksSlice";
import "./tasks.css";

const TaskList = ({ goalId }) => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) =>
        state.tasks.tasks.filter((task) => task.goalId === goalId)
    );

    return (
        <div className="tasks-container">
            {tasks.map((task) => (
                <div key={task.id} className="task">
                    <span>{task.title}</span>
                    <select
                        value={task.status}
                        onChange={(e) =>
                            dispatch(
                                updateTaskStatus({
                                    id: task.id,
                                    status: e.target.value,
                                })
                            )
                        }
                    >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
