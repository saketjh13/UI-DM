import Resource from "../models/Resource.js";
import Report from "../models/Report.js"
// Get all resources with usage breakdown
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources", error });
  }
};

// Create a new resource
export const createResource = async (req, res) => {
  try {
    const { name, type, quantity, location } = req.body;
    const newResource = new Resource({
      name,
      type,
      quantity,
      location,
      requestedQuantity: 0,
      usedQuantity: 0,
    });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: "Error creating resource", error });
  }
};

// Request resources (auto-update requested count)
export const requestResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    resource.requestedQuantity += amount;
    await resource.save();

    res.status(200).json({ message: "Resource requested", resource });
  } catch (error) {
    res.status(500).json({ message: "Error requesting resource", error });
  }
};

// Use resources (auto-update used count & reduce available)
export const useResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.quantity < amount) {
      return res.status(400).json({ message: "Not enough resources available" });
    }

    resource.quantity -= amount;
    resource.usedQuantity += amount;
    await resource.save();

    res.status(200).json({ message: "Resource used", resource });
  } catch (error) {
    res.status(500).json({ message: "Error using resource", error });
  }
};

// Update and delete (same as before)
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource", error });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource", error });
  }
};


export const getResourceSummary = async (req, res) => {
  try {
    // Step 1: Get all requested items from reports
    const requestedSummary = await Report.aggregate([
      { $unwind: "$requests" },
      {
        $project: {
          type: { $trim: { input: "$requests.type" } },
          resource: { $trim: { input: "$requests.resource" } },
          quantity: "$requests.quantity"
        }
      },
      {
        $match: {
          type: { $exists: true, $ne: null, $ne: "" },
          resource: { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: {
            type: "$type",
            resource: "$resource"
          },
          requestedQuantity: { $sum: "$quantity" }
        }
      }
    ]);

    // Step 2: Fetch available quantities
    const resources = await Resource.find();

    const resourceMap = {};
    resources.forEach(r => {
      const key = `${r.type.trim()}|${r.name.trim()}`;
      resourceMap[key] = r.quantity;
    });

    // Step 3: Merge requested + available
    const merged = {};

    requestedSummary.forEach(item => {
      const { type, resource } = item._id;
      const key = `${type}|${resource}`;
      const availableQuantity = resourceMap[key] || 0;

      if (!merged[type]) merged[type] = [];

      merged[type].push({
        resource,
        requestedQuantity: item.requestedQuantity,
        availableQuantity
      });
    });

    res.status(200).json({ success: true, data: merged });
  } catch (err) {
    console.error("Error fetching resource summary:", err);
    res.status(500).json({ success: false, message: "Failed to get resource summary" });
  }
};
