import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidStatus } from "@/lib/task-status";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!isValidStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return NextResponse.json(task);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("PATCH /api/tasks/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("DELETE /api/tasks/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
