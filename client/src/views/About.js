export default function About() {
   return (
      <div className="page">
         <h1 className="page-title">About SudokuChecker</h1>

         <section className="body-copy">
            <h2 className="section-title">Introduction</h2>
            <p>Sudoku Checker is an assistive web app for playing Sudoku. Sudoku is a "logic-based, combinatorial number placement" puzzle (<a className="link_style-text" href="https://en.wikipedia.org/wiki/Sudoku">read more about Sudoku here</a>). This app features a tip system to keep track of which numbers have not been played yet in each region. Regions with tips turned on will validate as a player enters numbers, changing to yellow if a region has an error or green if the region is valid. "Valid" regions may not indicate the correct solution (there are no "answers" to compare the player's board to), but are intended to aid the player as they solve the sudoku puzzle.</p>
         </section>

         <section className="body-copy">
            <h2 className="section-title">Background</h2>
            <p>For a long time solving Sudoku puzzles was my offline pastime of choice. Members of my family have also enjoyed the activity off and on, and my dad in particular took the hobby up actively in retirement. The puzzles he played largely came from the issues of the local paper he received weekly, and playing sudoku on the myriad of phone apps that are available never interested him. Overtime he found that keeping track of the numbers grew more difficult, and to give himself an aid he would set up an Excel spreadsheet to plot the puzzles out on. Utilizing the SUM function allowed him to kind of track what numbers were missing from each region, but because it was only SUM and not individual numbers it largely only assisted in identifying the last number and verifying if there were errors in a filled-in puzzle. The spreadsheet at its largest had over a thousand rows containing months of newspaper puzzles. After he described his process I decided this would be a great basis for my first full stack web project.</p>
         </section>

         <section className="body-copy">
            <h2 className="section-title">Project Goals and Features</h2>
            <p>This project was intended to solve one user's very specific use case: translate printed sudoku puzzles into a digital format and provide assistive tools to relieve the cognitive load in solving them. For those who have not tried a Sudoku, common strategies include looking at a given region and figuring out what is missing, then holding those numbers in your head and comparing them to what is missing or present in other regions. For complex puzzles, trial and error may be required, so a player might write little numbers in corners of cells or make notes elsewhere. In printed format the latter technique quickly becomes messy and unwieldy. This web app should therefore be considered an accessibility aid, in a sense, to playing Sudoku rather than a puzzle platform itself like other Sudoku apps. This app does not store puzzle answers or puzzles outside of those provided by the users.</p>

            <p>The key features of this web app include:</p>
            <ul className='list'>
               <li>The ability to add puzzles from printed sources into the database (approved users only)</li>
               <li>The ability to toggle region tips, which would contain all the missing numbers from the given region</li>
               <li>Validate regions as the player placed numbers (if tip opened, show corresponding color indicators depending on region state)</li>
               <li>Validate completed puzzles (return if the puzzle is a valid Sudoku solution)</li>
            </ul>
            <p>Additional features I added to improve user experience:</p>
            <ul className='list'>
               <li>Ability to see a list of available puzzles, grouped by difficulty</li>
               <li>Ability to undo previous choices</li>
            </ul>
            <p>For users with accounts:</p>
            <ul className='list'>
               <li>A dashboard of puzzles the player has engaged with, grouped by status</li>
               <li>Puzzles are saved automatically, allowing users to return to them later</li>
               <li>A settings pane for selecting specific colors and font styles for each of the three number types (puzzle start numbers and two alternative player styles to denote a guess versus a confidant number placement)</li>
            </ul>
         </section>

         <section className="body-copy">
            <h2 className="section-title">Technology</h2>
            <p>Since my background is predominately in web design and development, I decided to build this project in JavaScript. I enjoyed working in React after a couple of work projects, and thus chose to use a stack that would incorporate it for the front end. The puzzles and user information is stored in a NoSQL database provider, <a className="link_style-text" href="https://www.mongodb.com/">MongoDB</a>. The web server is <a className="link_style-text" href="https://nodejs.org/en/about">Node.js</a> with <a className="link_style-text" href="https://expressjs.com/">Express.js</a> for the framework. The UI uses <a className="link_style-text" href="https://react.dev/">React</a>, with <a className="link_style-text" href="https://react-redux.js.org/">Redux</a> and <a className="link_style-text" href="https://reactrouter.com/en/main">Retour</a> for handling state storage and routing respectively. Too many smaller packages to name were also instrumental.</p>

            <p>I wish I still had links to the three MERN stack tutorials I did in preparation for this project. A general shout out to the YouTube developer community will have to suffice for now, without whom this project would not be possible. My favorite place to learn coding fundamentals is <a className="link_style-text" href="https://www.codecademy.com/">Codecademy</a>, which gave me the confidence to dive headfirst in my front-end web developer career back in the early 2010s. It was there that I first learned React and Angular basics when my boss at the time and I were debating what to build the <a className="link_style-text" href="https://caitlinteague.com/archive/dashboard/">IT Dashboard</a> in. Through <a className="link_style-text" href="https://learn.mongodb.com/">MongoDB University</a> I learned the fundamentals of NoSQL and discovered I am a nerd about database design (New Skill Unlocked). Lastly, I would be remiss to forget <a className="link_style-text" href="https://www.codingame.com">CodinGame</a>, a fun space to try programming challenges in your preferred programming languages, and whose Sudoku themed puzzles were instrumental in translating this web app idea into something actually playable.</p>
         </section>

         <section className="body-copy">
            <h2 className="section-title">A Note on Visual Design</h2>
            <p>The visual design of this app is simple and neat, intended to invoke the sense of a wireframe with its gray containers and bright blue links and buttons. Which is a long way of saying I paid little consideration to colors and layout choices at all.  The technical aspect of launching a full stack web app with user logins and databases was the primary focus of this project, so visual design took a back seat. One of my scope creep to-do items is to create themes in different color palettes, one of my favorite design activities.</p>
            <p>This site was designed for one user who only used it with a desktop machine, and given the presentation of the features it is a very difficult UI to translate to small screens. I therefore skipped most of the normal responsive css work that I would have normally done to render this website compatible on most devices. On the plus side the puzzle listings page and this page will probably look fine on mobile, however I would not recommend solving a puzzle here from your phone.</p>
         </section>

         <section className="body-copy">
            <h2 className="section-title">Copyright</h2>
            <p>The puzzles seen in this web app, when not made up whole-cloth for testing, were sourced from various places. The source is always noted in the puzzle name. Any copyright or intellectual ownership is owned by those respective sources, and it is not my intention to infringe on those rights. Their inclusion here is for demonstration purposes and posterity only, not as a means of distribution or ownership claim.</p>
         </section>

         <section className="body-copy">
            <h2 className="section-title">In Memoriam</h2>
            <p>I made this project for one person, my dad, James Thomas Teague. I was fortunate to have him as a partner and an end user in this endeavor, and I was delighted to make him a tool he found helpful and enjoyable. This project launched in September 2021, and he diligently added five Appleton Post Crescent Sudoku puzzles a week until June 2022. He took a break in a month where he did a lot of traveling, visiting friends and family in Southern Illinois, and going to his 47th high school reunion. Sadly, on July 19th, 2022, he passed suddenly from complications due to heart failure.</p>

            <img src={ require('../img/dad-n-me_baby.png') } alt="Caitlin and Tom, circa 1988-1990" width="396" />

            <p>My dad was one of my favorite people. I miss his random phone calls to talk about something on C-SPAN, and the cute way he'd ask if there were any new "John and Hank Green" videos to watch together during my visits (the hidden joke here is Vlogbrothers is a long running biweekly-updated YouTube channel, so there is always new videos). Every time I assemble flat-pack furniture and take apart a broken appliance, I'll remember I got the audacity to try from him. When I cry at a soaring orchestral number played over a rousing speech, or get frustrated when something on the computer doesn't work right, I'll remember my outward emotional responses were learned from him. When I watch our favorite stand up comics and political humorists, I'll remember how we laughed together and the discussions they inspired. He's as much of a part of me as one could expect a parent to be, and I am honored to carry his legacy of ingenuity, curiosity, and duty.</p>

            <img src={ require('../img/dad-n-me.png') } alt="Caitlin and Tom, February 21st, 2015" width="396" />
         </section>
      </div>
   )
}