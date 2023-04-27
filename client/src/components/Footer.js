export default function Footer(props) {
   const { theme } = props;
   const year = new Date().getFullYear();

   return (
      <footer className={`footer footer_theme-${theme}`}>

         <p className="small">&copy;{year} Caitlin Teague Doerr 
            <br/> To contact owner/developer, send an email to <a className="link_style-text" href="mailto:design@caitlinteague.com">design@caitlinteague.com</a> 
            <br/> <a className="link_style-text" href="https://caitlinteague.com/builds">View more projects in Caitlin's portfolio</a>
         </p>

      </footer>
   )
}