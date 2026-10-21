import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Store,
  Bike,
  Eye,
  Check,
  X,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Card from "../../../components/common/Card/Card";
import CommonTable from "../../../components/common/CommonTable/CommonTable";
import TableToolbar from "../../../components/common/TableToolbar/TableToolbar";
import Pagination from "../../../components/common/Pagination/Pagination";
import Button from "../../../components/common/Button/Button";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Drawer from "../../../components/common/Drawer/Drawer";
import Modal from "../../../components/common/Modal/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import {
  fetchAdminResource,
  performAdminAction,
} from "../../../redux/thunks/admin/admin.thunk";

const rejectionSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Give a reason of at least 5 characters")
    .max(1000),
});
export default function AdminPartners({ kind }) {
  const restaurant = kind === "restaurants";
  const Icon = restaurant ? Store : Bike;
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const status = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(
    searchParams.get("status")
  )
    ? searchParams.get("status")
    : "ALL";
  const dispatch = useDispatch();
  const { data, pagination, loading, error } = useSelector(
    (state) => state.admin.resources[kind]
  );
  const busy = useSelector((state) => state.admin.actionLoading);
  const name = (row) => (restaurant ? row.restaurantName : row.name);
  const key = (row) => (restaurant ? row.slug : row.publicId);
  const reload = () =>
    dispatch(
      fetchAdminResource({
        resource: kind,
        params: { page, limit: 15, search, status },
      })
    );
  useEffect(() => {
    let request;
    const timer = setTimeout(() => {
      request = dispatch(
        fetchAdminResource({
          resource: kind,
          params: { page, limit: 15, search, status },
        })
      );
    }, 250);
    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [dispatch, kind, page, search, status]);
  const changeStatus = (value) => {
    setPage(1);
    setSearchParams(value === "ALL" ? {} : { status: value });
  };
  const decide = async (values = {}) => {
    if (!decision || busy) return;
    try {
      const response = await dispatch(
        performAdminAction({
          path: `${kind}/${encodeURIComponent(key(decision.row))}/${
            decision.type
          }`,
          payload:
            decision.type === "reject" ? { reason: values.reason } : undefined,
        })
      ).unwrap();
      toast.success(response.message || "Application updated");
      setDecision(null);
      setSelected(null);
      if ((data?.length || 0) === 1 && page > 1 && status === "PENDING")
        setPage(page - 1);
      else reload();
    } catch (message) {
      toast.error(String(message));
    }
  };
  const columns = [
    {
      key: "name",
      label: restaurant ? "Restaurant" : "Delivery partner",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-slate-900">{name(row)}</p>
            <p className="mt-1 text-xs text-slate-500">
              {restaurant ? row.ownerName : row.publicId}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (row) => (
        <div>
          <p>{row.email}</p>
          <p className="mt-1 text-xs text-slate-500">
            {row.phone || "No phone"}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      label: restaurant ? "Location" : "Vehicle",
      render: (row) =>
        restaurant ? (
          <span>{[row.city, row.state].filter(Boolean).join(", ")}</span>
        ) : (
          <div>
            <p>{row.vehicleType || "—"}</p>
            <p className="mt-1 text-xs text-slate-500">
              {row.vehicleNumber || "—"}
            </p>
          </div>
        ),
    },
    {
      key: "approvalStatus",
      label: "Approval",
      render: (row) => (
        <StatusBadge
          variant={
            row.approvalStatus === "APPROVED"
              ? "success"
              : row.approvalStatus === "PENDING"
              ? "warning"
              : "danger"
          }
        >
          {row.approvalStatus}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={Eye}
            onClick={() => setSelected(row)}
          >
            Review
          </Button>
          {row.approvalStatus === "PENDING" && (
            <Button
              size="sm"
              leftIcon={Check}
              disabled={busy}
              onClick={() => setDecision({ row, type: "approve" })}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={restaurant ? "Restaurants" : "Delivery partners"}
        description={
          restaurant
            ? "Meet your restaurant partners. Review applications and oversee your network."
            : "Review new riders and keep your delivery network in view."
        }
        actions={
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={reload}
          >
            Refresh
          </Button>
        }
      />
      <Card padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-black">
                {pagination?.total ?? "—"}
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {status === "ALL"
                    ? "registered partners"
                    : `${status.toLowerCase()} partners`}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Every good delivery starts with the right people.
              </p>
            </div>
          </div>
          <StatusBadge variant="neutral">Partner management</StatusBadge>
        </div>
      </Card>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Approval status"
      >
        {[
          "ALL",
          "PENDING",
          "APPROVED",
          "REJECTED",
          ...(restaurant ? ["SUSPENDED"] : []),
        ].map((value) => (
          <Button
            key={value}
            variant={status === value ? "primary" : "outline"}
            aria-pressed={status === value}
            onClick={() => changeStatus(value)}
          >
            {value === "ALL"
              ? "All partners"
              : value.charAt(0) + value.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
      <Card>
        <TableToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={
            restaurant
              ? "Search restaurant, owner, email or city..."
              : "Search name, email, phone or partner ID..."
          }
        />
        {error && (
          <div className="mt-4">
            <ErrorState
              title="Unable to load partners"
              description={error}
              onRetry={reload}
            />
          </div>
        )}
        <div className="mt-5">
          <CommonTable
            columns={columns}
            data={data || []}
            rowKey={restaurant ? "slug" : "publicId"}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Icon}
                title="No partners found"
                description="Try another search or approval filter."
              />
            }
          />
        </div>
        <div className="mt-5">
          <Pagination
            currentPage={page}
            totalPages={pagination?.totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      </Card>
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        side="right"
        size="xl"
        title="Partner details"
        description="Review the application before making a decision."
        disableClose={busy}
        footer={
          selected?.approvalStatus === "PENDING" ? (
            <div className="flex gap-3">
              <Button
                fullWidth
                leftIcon={Check}
                disabled={busy}
                onClick={() => setDecision({ row: selected, type: "approve" })}
              >
                Approve
              </Button>
              <Button
                fullWidth
                variant="danger"
                leftIcon={X}
                disabled={busy}
                onClick={() => setDecision({ row: selected, type: "reject" })}
              >
                Reject
              </Button>
            </div>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-orange-50 p-5">
              <Icon
                className="mb-4 h-8 w-8 text-orange-600"
                aria-hidden="true"
              />
              <h2 className="text-xl font-black">{name(selected)}</h2>
              <p className="mb-3 mt-1 text-sm text-slate-500">
                {restaurant ? selected.ownerName : selected.publicId}
              </p>
              <StatusBadge
                variant={
                  selected.approvalStatus === "PENDING"
                    ? "warning"
                    : selected.approvalStatus === "APPROVED"
                    ? "success"
                    : "danger"
                }
              >
                {selected.approvalStatus}
              </StatusBadge>
            </div>
            <dl className="space-y-5">
              {[
                [Mail, "Email", selected.email],
                [Phone, "Phone", selected.phone],
                [
                  MapPin,
                  "Address",
                  restaurant
                    ? [
                        selected.addressLine,
                        selected.city,
                        selected.state,
                        selected.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    : selected.address,
                ],
                [
                  Icon,
                  restaurant ? "Business status" : "Vehicle",
                  restaurant
                    ? selected.isOpen
                      ? "Open"
                      : "Closed"
                    : [selected.vehicleType, selected.vehicleNumber]
                        .filter(Boolean)
                        .join(" · "),
                ],
              ].map(([DetailIcon, label, value]) => (
                <div key={label} className="flex gap-3">
                  <DetailIcon
                    className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {value || "Not provided"}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            {selected.rejectionReason && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                Rejection reason: {selected.rejectionReason}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Registered{" "}
              {new Date(selected.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        )}
      </Drawer>
      <ConfirmModal
        open={decision?.type === "approve"}
        onClose={() => setDecision(null)}
        title="Approve this partner?"
        description={
          decision
            ? `${name(decision.row)} will be approved to use the platform.`
            : ""
        }
        confirmText="Approve partner"
        confirmVariant="primary"
        icon={Check}
        loading={busy}
        onConfirm={() => decide()}
      />
      <Modal
        open={decision?.type === "reject"}
        onClose={() => setDecision(null)}
        disableClose={busy}
        title="Reject application"
        description="Give the partner a clear reason for this decision."
      >
        <CommonForm
          key={decision ? key(decision.row) : "reject"}
          fields={[
            {
              name: "reason",
              label: "Rejection reason",
              type: "textarea",
              required: true,
            },
          ]}
          schema={rejectionSchema}
          defaultValues={{ reason: "" }}
          columns={1}
          loading={busy}
          onSubmit={decide}
          onCancel={() => setDecision(null)}
          submitText="Reject application"
        />
      </Modal>
    </div>
  );
}
