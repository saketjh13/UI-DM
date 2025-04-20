import Task from "../models/Task.js";
import Event from "../models/Event.js";

const checkAndArchiveEvent = async (eventId) => {
  const tasks = await Task.find({ event: eventId });

  const allCompleted = tasks.every((task) => task.status === "Completed");

  if (allCompleted) {
    await Event.findByIdAndUpdate(eventId, { archived: true });
    console.log(`✅ Event ${eventId} archived (all tasks completed)`);
  }
};

export default checkAndArchiveEvent;
