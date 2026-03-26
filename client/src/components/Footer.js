export default function Footer(props) {
  const { theme } = props;
  const year = new Date().getFullYear();

  return (
    <footer className={`footer footer_theme-${theme}`}>
      <p className="small">&copy;{year} Caitlin Teague Doerr</p>
      <p className="small">
        To contact owner/developer,{" "}
        <a className="link_style-text" href="mailto:design@caitlinteague.com">
          send an email
        </a>{" "}
        to <span className="text-bold">design@caitlinteague.com</span>
      </p>
      <p className="small">
        <a className="link_style-text" href="https://caitlinteague.com/builds">
          View more projects in Caitlin's portfolio
        </a>
      </p>
    </footer>
  );
}
