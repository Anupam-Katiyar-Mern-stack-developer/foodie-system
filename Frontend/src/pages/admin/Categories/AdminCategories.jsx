import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tags, Plus, Pencil, Trash2, Power, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Card from "../../../components/common/Card/Card";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import TableToolbar from "../../../components/common/TableToolbar/TableToolbar";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Modal from "../../../components/common/Modal/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";
import { adminCategoryFields } from "../../../forms/admin/admin.form";
import { adminCategorySchema } from "../../../validations/admin/admin.validation";
import { fetchAdminResource, performAdminAction } from "../../../redux/thunks/admin/admin.thunk";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.admin.resources.categories);
  const busy = useSelector((state) => state.admin.actionLoading);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const reload = () => dispatch(fetchAdminResource({ resource: "categories" }));
  useEffect(() => { const request = dispatch(fetchAdminResource({ resource: "categories" })); return () => request.abort(); }, [dispatch]);
  const save = async (values) => {
    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("description", values.description || "");
    payload.append("displayOrder", String(values.displayOrder));
    if (values.image instanceof File) payload.append("image", values.image);
    try {
      const response = await dispatch(performAdminAction({ method: form.category ? "patch" : "post", path: form.category ? `categories/${encodeURIComponent(form.category.slug)}` : "categories", payload })).unwrap();
      toast.success(response.message || "Category saved"); setForm(null); reload();
    } catch (message) { toast.error(String(message)); }
  };
  const confirm = async () => {
    if (!confirmation || busy) return;
    const { row, type } = confirmation;
    try {
      const response = await dispatch(performAdminAction({ method: type === "delete" ? "delete" : "patch", path: `categories/${encodeURIComponent(row.slug)}${type === "status" ? "/status" : ""}`, payload: type === "status" ? { isActive: !row.isActive } : undefined })).unwrap();
      toast.success(response.message || "Category updated"); setConfirmation(null); reload();
    } catch (message) { toast.error(String(message)); }
  };
  const categories = (data || []).filter((row) => `${row.name} ${row.description || ""}`.toLowerCase().includes(search.toLowerCase()));
  const columns = [
    { key: "name", label: "Category", render: (row) => <div className="flex items-center gap-3"><OptimizedImage src={row.image} alt={row.name} className="h-12 w-12" wrapperClassName="h-12 w-12 shrink-0" /><div><p className="font-bold text-slate-900">{row.name}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500">{row.description || "No description"}</p></div></div> },
    { key: "displayOrder", label: "Display order" },
    { key: "isActive", label: "Visibility", render: (row) => <StatusBadge variant={row.isActive ? "success" : "neutral"}>{row.isActive ? "Active" : "Hidden"}</StatusBadge> },
    { key: "actions", label: "Actions", align: "right", render: (row) => <div className="flex justify-end gap-1"><Button variant="ghost" size="sm" leftIcon={Pencil} disabled={busy} onClick={() => setForm({ category: row })}>Edit</Button><Button variant="ghost" size="sm" aria-label={`${row.isActive ? "Hide" : "Activate"} ${row.name}`} disabled={busy} onClick={() => setConfirmation({ row, type: "status" })}><Power className="h-4 w-4" /></Button><Button variant="ghost" size="sm" className="text-red-600" aria-label={`Delete ${row.name}`} disabled={busy} onClick={() => setConfirmation({ row, type: "delete" })}><Trash2 className="h-4 w-4" /></Button></div> },
  ];
  return <div className="space-y-6"><PageHeader title="Categories" description="Organise the flavours your customers come looking for." actions={<><Button variant="outline" leftIcon={RefreshCw} loading={loading} onClick={reload}>Refresh</Button><Button leftIcon={Plus} onClick={() => setForm({ category: null })}>Add category</Button></>} /><div className="grid gap-4 sm:grid-cols-3">{[["Total categories", data?.length], ["Visible to customers", data?.filter((row) => row.isActive).length], ["Hidden categories", data?.filter((row) => !row.isActive).length]].map(([label, value]) => <Card key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value ?? "—"}</p></Card>)}</div><Card><TableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search categories..." />{error && <ErrorState title="Unable to load categories" description={error} onRetry={reload} />}<div className="mt-5"><CommonTable columns={columns} data={categories} rowKey="slug" loading={loading} minWidth="min-w-[650px]" emptyState={<EmptyState icon={Tags} title="No categories found" description="Add your first category or try a different search." />} /></div></Card><Modal open={Boolean(form)} onClose={() => setForm(null)} disableClose={busy} title={form?.category ? "Edit category" : "Add a category"} description="Make it easy for customers to find their next favourite." size="lg">{form && <CommonForm key={form.category?.slug || "new"} fields={adminCategoryFields(form.category)} schema={adminCategorySchema(Boolean(form.category))} defaultValues={{ name: form.category?.name || "", description: form.category?.description || "", displayOrder: form.category?.displayOrder ?? 0, image: null }} onSubmit={save} loading={busy} onCancel={() => setForm(null)} submitText="Save category" />}</Modal><ConfirmModal open={Boolean(confirmation)} onClose={() => setConfirmation(null)} onConfirm={confirm} loading={busy} title={confirmation?.type === "delete" ? "Delete category?" : confirmation?.row.isActive ? "Hide category?" : "Activate category?"} description={confirmation?.type === "delete" ? `Delete “${confirmation.row.name}”? Categories used by foods cannot be deleted.` : "Update this category’s visibility for customers."} confirmText={confirmation?.type === "delete" ? "Delete category" : "Update visibility"} confirmVariant={confirmation?.type === "delete" ? "danger" : "primary"} /></div>;
}
