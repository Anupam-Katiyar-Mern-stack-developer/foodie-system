import CommonTable from "../../common/CommonTable/CommonTable";
import StatusBadge from "../../common/StatusBadge/StatusBadge";
import Button from "../../common/Button/Button";


const FoodTable = ({
  foods,
  loading,
  onEdit,
  onDelete,
  deletingSlug,
}) => {

  const columns = [
    {
      key: "name",
      label: "Food",
    },

    {
      key: "price",
      label: "Price",

      render: (food) => (
        <span>
          ₹{food.price}
        </span>
      ),
    },

    {
      key: "isAvailable",
      label: "Availability",

      render: (food) => (
        <StatusBadge
          variant={
            food.isAvailable
              ? "success"
              : "danger"
          }
        >
          {food.isAvailable
            ? "Available"
            : "Unavailable"}
        </StatusBadge>
      ),
    },

    {
      key: "actions",
      label: "Actions",

      align: "right",

      stickyRight: true,

      render: (food) => (
        <div
          className="
            flex
            justify-end
            gap-2
          "
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onEdit(food)
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="danger"

            loading={
              deletingSlug ===
              food.slug
            }

            loadingText="Deleting..."

            onClick={() =>
              onDelete(food)
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];


  return (
    <CommonTable
      columns={columns}
      data={foods}
      rowKey="slug"
      loading={loading}
    />
  );
};


export default FoodTable;