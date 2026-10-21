import {
  getAdminDashboardService, getAdminListService,
  getAdminProfileService, updateAdminProfileService,
} from "../../services/admin.service.js";

export const getAdminDashboard = async (req, res, next) => {
  try { res.json({ success: true, data: await getAdminDashboardService() }); }
  catch (error) { next(error); }
};

export const getAdminList = (resource) => async (req, res, next) => {
  try {
    const { items, pagination } = await getAdminListService(resource, req.query);
    res.json({ success: true, data: items, pagination });
  } catch (error) { next(error); }
};

export const getAdminProfile = async (req, res, next) => {
  try { res.json({ success: true, data: await getAdminProfileService(req.admin.adminId) }); }
  catch (error) { next(error); }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const data = await updateAdminProfileService({ adminId: req.admin.adminId, name, email, currentPassword, newPassword });
    res.json({ success: true, message: "Admin account updated", data });
  } catch (error) { next(error); }
};
