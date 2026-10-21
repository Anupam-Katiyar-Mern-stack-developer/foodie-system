import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  ShoppingBag,
  CreditCard,
  Banknote,
  ArrowLeft,
  ShieldCheck,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "../../../components/common/Container/Container";
import Card from "../../../components/common/Card/Card";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import Checkbox from "../../../components/common/Checkbox/Checkbox";
import OptimizedImage from "../../../components/common/OptimizedImage/OptimizedImage";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import ErrorState from "../../../components/common/ErrorState/ErrorState";
import Skeleton from "../../../components/common/Skeleton/Skeleton";
import { placeOrder } from "../../../redux/thunks/public/order.thunk";
import { getCart } from "../../../redux/thunks/public/cart.thunk";
import { getAddresses } from "../../../redux/thunks/public/address.thunk";
import {
  getCheckoutQuote,
  getPaymentConfig,
  payForCheckout,
} from "../../../services/public/payment.service";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cartGroups,
    fetchLoading: cartLoading,
    error: cartError,
  } = useSelector((s) => s.publicCart);
  const {
    addresses,
    fetchLoading: addressLoading,
    error: addressError,
  } = useSelector((s) => s.publicAddress);
  const { settings } = useSelector((s) => s.siteSettings);
  const [selectedId, setSelectedId] = useState(null);
  const [requestedMethod, setMethod] = useState("COD");
  const method =
    requestedMethod === "ONLINE" && settings.onlineEnabled
      ? "ONLINE"
      : settings.codEnabled
      ? "COD"
      : "ONLINE";
  const [useBrowser, setUseBrowser] = useState(true);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteRevision, setQuoteRevision] = useState(0);
  const [gateway, setGateway] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const requestKey = useRef(null);
  const inFlight = useRef(false);
  const cartVersion = JSON.stringify(
    cartGroups.map((g) => [
      g.restaurant.slug,
      g.items.map((i) => [i.slug, i.quantity, i.price, i.discountPrice]),
    ])
  );
  useEffect(() => {
    dispatch(getCart());
    dispatch(getAddresses());
    getPaymentConfig()
      .then(setGateway)
      .catch(() => setGateway({ configured: false }));
  }, [dispatch]);
  useEffect(() => {
    if (!cartGroups.length) return;
    const controller = new AbortController();
    setQuoteLoading(true);
    setQuoteError("");
    setQuote(null);
    getCheckoutQuote(appliedCode, controller.signal)
      .then(setQuote)
      .catch((err) => {
        if (!controller.signal.aborted)
          setQuoteError(
            err.response?.data?.message || "Unable to calculate checkout total"
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setQuoteLoading(false);
      });
    return () => controller.abort();
  }, [cartVersion, appliedCode, cartGroups.length, quoteRevision]);
  const address =
    addresses.find((a) => String(a.id) === String(selectedId)) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];
  const blocked = cartGroups.some(
    (g) =>
      g.restaurant.isOpen === false ||
      g.items.some((i) => i.isAvailable === false)
  );
  const resume = async (number) => {
    setBusy(true);
    setError("");
    try {
      await payForCheckout(number);
      toast.success("Payment verified. Your order is confirmed.");
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const submit = async () => {
    if (
      inFlight.current ||
      busy ||
      !address ||
      !quote ||
      quoteLoading ||
      blocked
    )
      return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      let coordinates = {};
      if (useBrowser) {
        if (!window.isSecureContext || !navigator.geolocation)
          throw new Error("Use HTTPS or localhost and allow browser location.");
        const location = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          })
        );
        coordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      }
      if (!requestKey.current) requestKey.current = crypto.randomUUID();
      const result = await dispatch(
        placeOrder({
          addressId: address.id,
          paymentMethod: method,
          couponCode: appliedCode || undefined,
          requestKey: requestKey.current,
          expectedTotal: quote.grandTotal,
          ...coordinates,
        })
      ).unwrap();
      if (result.paymentMethod === "ONLINE") {
        setPending(result.checkoutNumber);
        dispatch(getCart());
        await payForCheckout(result.checkoutNumber);
        toast.success("Payment verified. Your order is confirmed.");
      } else dispatch(getCart());
      navigate("/orders", { replace: true });
    } catch (err) {
      setQuoteRevision((value) => value + 1);
      setError(
        typeof err === "string"
          ? err
          : err.code === 1
          ? "Please allow location access."
          : err.response?.data?.message ||
            err.message ||
            "Unable to place order."
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  if ((cartLoading || addressLoading) && !cartGroups.length && !pending)
    return (
      <Container>
        <div className="space-y-5 py-10">
          <Skeleton height="h-10" width="w-64" />
          <Skeleton height="h-80" width="w-full" />
        </div>
      </Container>
    );
  if (pending)
    return (
      <Container>
        <div className="mx-auto max-w-xl space-y-5 py-16">
          <Card
            title="Your checkout is saved"
            description="Your restaurants will receive this order after payment is verified."
          >
            <p className="mb-4 font-mono text-sm">{pending}</p>
            {error && (
              <p role="alert" className="mb-4 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button loading={busy} onClick={() => resume(pending)}>
                Continue payment
              </Button>
              <Button variant="outline" onClick={() => navigate("/orders")}>
                My orders
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    );
  if (cartError || addressError)
    return (
      <Container>
        <div className="py-10">
          <ErrorState
            title="Unable to load checkout"
            description={cartError || addressError}
            onRetry={() => {
              dispatch(getCart());
              dispatch(getAddresses());
            }}
          />
        </div>
      </Container>
    );
  if (!cartGroups.length)
    return (
      <Container>
        <div className="py-16">
          <EmptyState
            icon={ShoppingBag}
            title="Something delicious is waiting"
            description="Add your favourites to the cart to start your order."
            action={
              <Button onClick={() => navigate("/restaurants")}>
                Explore restaurants
              </Button>
            }
          />
        </div>
      </Container>
    );
  return (
    <Container>
      <div className="space-y-7 py-8 sm:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to cart
        </Link>
        <PageHeader
          title="A few details. Then, delicious."
          description="Choose your delivery point, apply an offer and make it yours."
        />
        <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card
              title="Delivery address"
              headerAction={
                <Button variant="ghost" onClick={() => navigate("/addresses")}>
                  Manage addresses
                </Button>
              }
            >
              {!addresses.length ? (
                <EmptyState
                  icon={MapPin}
                  title="Add a delivery address"
                  description="Save your contact and address details before ordering."
                  action={
                    <Button onClick={() => navigate("/addresses")}>
                      Add address
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
                        String(a.id) === String(address?.id)
                          ? "border-orange-400 bg-orange-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery-address"
                        checked={String(a.id) === String(address?.id)}
                        onChange={() => setSelectedId(a.id)}
                        className="mt-1 accent-orange-500"
                      />
                      <span>
                        <span className="font-bold">
                          {a.label}
                          {a.isDefault ? " · Default" : ""}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">
                          {[
                            a.addressLine,
                            a.landmark,
                            a.city,
                            a.state,
                            a.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <div className="mt-5 border-t pt-4">
                <Checkbox
                  checked={useBrowser}
                  onChange={(event) => setUseBrowser(event.target.checked)}
                  label="Deliver to my current browser location"
                  description="Place the order from the delivery address. Uncheck to use the saved address coordinates."
                />
              </div>
            </Card>
            <Card
              title="Payment"
              description="Pay securely online or choose cash on delivery."
            >
              <div className="space-y-3">
                {[
                  ["COD", "Cash on delivery", Banknote, settings.codEnabled],
                  [
                    "ONLINE",
                    "Pay online with Razorpay",
                    CreditCard,
                    settings.onlineEnabled && gateway?.configured,
                  ],
                ].map(([value, label, Icon, enabled]) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-xl border p-4 ${
                      !enabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    } ${
                      method === value
                        ? "border-orange-400 bg-orange-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={value}
                      checked={method === value}
                      disabled={!enabled || busy}
                      onChange={() => setMethod(value)}
                      className="accent-orange-500"
                    />
                    <Icon
                      className="h-5 w-5 text-orange-600"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold">
                      {label}
                      {value === "ONLINE" && !gateway?.configured && (
                        <span className="mt-1 block text-xs font-normal">
                          Awaiting gateway configuration
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
            <Card title="Your favourites">
              {cartGroups.map((group) => (
                <div key={group.restaurant.slug} className="mb-5 last:mb-0">
                  <p className="mb-3 text-sm font-bold text-slate-900">
                    {group.restaurant.restaurantName}
                    {group.restaurant.isOpen === false
                      ? " · Currently closed"
                      : ""}
                  </p>
                  <div className="divide-y divide-slate-100">
                    {group.items.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-center gap-3 py-3"
                      >
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          wrapperClassName="h-12 w-12 shrink-0"
                          className="h-12 w-12"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Quantity {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-bold">
                          {money(
                            Number(item.discountPrice || item.price) *
                              Number(item.quantity)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <div className="space-y-5 lg:sticky lg:top-24">
            {settings.couponsEnabled && (
              <Card
                title="A little extra off"
                headerAction={
                  <Tag className="h-5 w-5 text-orange-600" aria-hidden="true" />
                }
              >
                <div className="flex items-end gap-2">
                  <Input
                    label="Coupon code"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.toUpperCase())
                    }
                    placeholder="Enter your code"
                    wrapperClassName="min-w-0 flex-1"
                  />
                  <Button
                    variant="outline"
                    disabled={!code.trim() || busy}
                    onClick={() => setAppliedCode(code.trim())}
                  >
                    Apply
                  </Button>
                </div>
                {appliedCode && (
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-orange-700">
                      {appliedCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAppliedCode("");
                        setCode("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Card>
            )}
            <Card title="Order summary">
              {quoteLoading ? (
                <Skeleton height="h-40" width="w-full" />
              ) : quoteError ? (
                <ErrorState
                  title="Check your order"
                  description={quoteError}
                  onRetry={() => {
                    setAppliedCode("");
                    setCode("");
                    setQuoteRevision((value) => value + 1);
                  }}
                />
              ) : (
                quote && (
                  <dl className="space-y-3 text-sm">
                    {[
                      ["Food subtotal", quote.foodTotal],
                      ["Delivery fee", quote.deliveryFee],
                      ["Tax", quote.taxAmount],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="font-semibold">{money(value)}</dd>
                      </div>
                    ))}
                    {quote.discount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <dt>Coupon discount</dt>
                        <dd>-{money(quote.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-4 text-lg font-black">
                      <dt>Total to pay</dt>
                      <dd>{money(quote.grandTotal)}</dd>
                    </div>
                  </dl>
                )
              )}
              {cartGroups.length > 1 && (
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  One checkout creates a separate delivery for each restaurant.
                  Delivery fees apply per restaurant.
                </p>
              )}
              {blocked && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  A restaurant is closed or an item is unavailable. Update your
                  cart.
                </p>
              )}
              {settings.maintenanceMode && (
                <p role="alert" className="mt-4 text-sm text-amber-800">
                  {settings.maintenanceMessage}
                </p>
              )}
              {error && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {error}
                </p>
              )}
              <Button
                fullWidth
                className="mt-6"
                loading={busy}
                loadingText="Preparing your order..."
                disabled={
                  !address ||
                  !quote ||
                  quoteLoading ||
                  blocked ||
                  settings.maintenanceMode ||
                  Number(quote?.foodTotal) < Number(settings.minimumOrder) ||
                  (method === "ONLINE" && !gateway?.configured) ||
                  (method === "COD" && !settings.codEnabled)
                }
                onClick={submit}
              >
                {method === "ONLINE"
                  ? "Continue to secure payment"
                  : "Place order · Cash on delivery"}
              </Button>
              {quote &&
                Number(quote.foodTotal) < Number(settings.minimumOrder) && (
                  <p className="mt-3 text-sm text-red-700">
                    Minimum food subtotal is {money(settings.minimumOrder)}.
                  </p>
                )}
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Order total verified by the server
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
