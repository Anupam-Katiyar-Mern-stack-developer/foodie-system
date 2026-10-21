import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UtensilsCrossed, Mail, Phone, MapPin } from "lucide-react";
import {
  FaInstagram as Instagram,
  FaFacebookF as Facebook,
} from "react-icons/fa";
import Container from "../../common/Container/Container";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";
import { footerSections } from "../../../data/public/footer";

export default function PublicFooter() {
  const { settings } = useSelector((state) => state.siteSettings);
  return (
    <footer className="bg-slate-950 text-white">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="flex w-fit items-center gap-3 rounded-xl text-2xl font-black focus-visible:outline-orange-400"
            >
              {settings.logo ? (
                <OptimizedImage
                  src={settings.logo}
                  alt={settings.siteName}
                  objectFit="contain"
                  wrapperClassName="h-12 w-12 bg-white"
                  className="h-12 w-12"
                />
              ) : (
                <span className="rounded-2xl bg-orange-500 p-3">
                  <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
                </span>
              )}
              {settings.siteName}
              <span className="text-orange-400">.</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              {settings.footerText}
            </p>
            <p className="mt-3 text-sm text-slate-300">{settings.tagline}</p>
            <div className="mt-5 flex gap-3">
              {[
                [settings.instagramUrl, "Instagram", Instagram],
                [settings.facebookUrl, "Facebook", Facebook],
              ]
                .filter(([url]) => url)
                .map(([url, label, Icon]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-xl border border-slate-700 p-3 text-slate-300 hover:text-orange-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
            </div>
          </div>
          {footerSections.slice(0, 2).map((section) => (
            <nav
              key={section.title}
              aria-label={`${section.title} footer links`}
            >
              <h2 className="mb-5 text-sm font-bold">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 transition-colors hover:text-orange-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="mb-5 text-sm font-bold">Here to help</h2>
            <div className="space-y-4 text-sm text-slate-400">
              {settings.supportEmail && (
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="flex items-start gap-2 break-all hover:text-orange-300"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {settings.supportEmail}
                </a>
              )}
              {settings.supportPhone && (
                <a
                  href={`tel:${settings.supportPhone.replace(/[^+0-9]/g, "")}`}
                  className="flex items-center gap-2 hover:text-orange-300"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {settings.supportPhone}
                </a>
              )}
              {settings.supportAddress && (
                <p className="flex gap-2 leading-6">
                  <MapPin
                    className="mt-1 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {settings.supportAddress}
                </p>
              )}
              <Link
                to="/restaurant/register"
                className="block hover:text-orange-300"
              >
                Become a restaurant partner
              </Link>
              <Link
                to="/delivery/register"
                className="block hover:text-orange-300"
              >
                Become a delivery partner
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-800 py-6 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights
            reserved.
          </p>
          <p>Good food. Better company.</p>
        </div>
      </Container>
    </footer>
  );
}
