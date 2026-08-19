import AdminSearchBar from "./AdminSearchBar";

// Desktop-only topbar sitting above the page content, to the right of the
// fixed sidebar. Hidden on mobile — AdminMobileHeader's search icon covers
// that case instead, since there isn't room for a full bar there.
export default function AdminTopbar() {
  return (
    <div className="hidden lg:flex items-center justify-end px-8 py-4 border-b border-gray-200 bg-white">
      <AdminSearchBar variant="bar" />
    </div>
  );
}