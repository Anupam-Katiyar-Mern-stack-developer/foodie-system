import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, UserRound, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Card from "../../../components/common/Card/Card";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import { adminProfileFields } from "../../../forms/admin/admin.form";
import { adminProfileSchema } from "../../../validations/admin/admin.validation";
import { saveAdminProfile } from "../../../redux/thunks/admin/admin.thunk";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const { profile, actionLoading } = useSelector((state) => state.admin);
  const submit = async (values, form) => {
    try {
      const updated = await dispatch(saveAdminProfile(values)).unwrap();
      form.reset({
        name: updated.name,
        email: updated.email,
        currentPassword: "",
        newPassword: "",
      });
      toast.success("Admin account updated");
    } catch (message) {
      toast.error(String(message));
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Account settings"
        description="Manage your admin identity and sign-in details."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_2fr]">
        <Card padding="lg">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-2xl font-black text-orange-700">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </span>
          <h2 className="text-xl font-black">{profile?.name}</h2>
          <p className="mb-4 mt-1 break-all text-sm text-slate-500">
            {profile?.email}
          </p>
          <StatusBadge variant="info">Super administrator</StatusBadge>
          <div className="mt-7 border-t pt-5">
            <ShieldCheck
              className="mb-3 h-6 w-6 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold">Your workspace, protected.</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Confirm your current password whenever you change your account
              details. Use a strong, unique password for admin access.
            </p>
          </div>
        </Card>
        <div className="space-y-6">
          <Card
            title="Profile & security"
            description="Keep your administrator details up to date."
            padding="lg"
            headerAction={
              <UserRound
                className="h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
            }
          >
            <CommonForm
              key={profile?.id}
              fields={adminProfileFields}
              schema={adminProfileSchema}
              defaultValues={{
                name: profile?.name || "",
                email: profile?.email || "",
                currentPassword: "",
                newPassword: "",
              }}
              onSubmit={submit}
              loading={actionLoading}
              showCancel={false}
              submitText="Save account changes"
            />
          </Card>
          <Card>
            <div className="flex gap-3">
              <LockKeyhole
                className="h-5 w-5 shrink-0 text-orange-600"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-slate-600">
                These settings update your administrator account. Restaurant
                operating hours and menu availability are managed in each
                restaurant’s workspace.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
