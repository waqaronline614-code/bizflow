function Footer() {
  return (
    <footer className="mt-4 border-t border-black py-4">
      <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">

        <p>
          © {new Date().getFullYear()} <span className="font-semibold">BizFlow</span>. All rights reserved.
        </p>

        <p className="mt-2 md:mt-0">
          Version <span className="font-medium">1.0.0</span>
        </p>

      </div>
    </footer>
  );
}

export default Footer;