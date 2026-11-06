import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import appTarget from '../app-target';
import styles from './credits.css';
import {getInitialDarkMode} from '../../lib/tw-theme-hoc.jsx';

// import fosshostLogo from './fosshost-light.png';
import UserData from './users';

/* eslint-disable react/jsx-no-literals */

document.documentElement.lang = 'en';

const User = ({image, text, href}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.user}
    >
        <img
            className={styles.userImage}
            src={image}
            width="60"
            height="60"
        />
        <div className={styles.userInfo}>
            {text}
        </div>
    </a>
);
User.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string
};

const UserList = ({users}) => (
    <div className={styles.users}>
        {users.map((data, index) => (
            <User
                key={index}
                {...data}
            />
        ))}
    </div>
);
UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
};

const Credits = () => (
    <main className={styles.main}>
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                Ketey IDE Credits
            </h1>
        </header>
        <section>
            <h1>Ketey IDE</h1>
        </section>
        <section>
            <h2>Thank you</h2>
            <p>
                Without TurboWarp, PenguinMod and Snail IDE, Ketey IDE may have never existed.
                Thank you to everyone who worked on Scratch, TurboWarp, PenguinMod and Snail IDE
                you have made many people finally be able to make whatever they can imagine.
            </p>
            <a href="https://scratch.mit.edu/donate">
                Donate to support Scratch.
            </a>
            <br></br><br></br>
            <a href="https://github.com/sponsors/GarboMuffin">
                Donate to support TurboWarp.
            </a>
            <h2>Developers</h2>
            <b>Fun Fact: Snail IDE was originally made only by @Mr_rudy/nmsderp, but he still makes a majority of the commits! Eventually, BA4X joined the dev team. Then, @o97doge/ACat/someCatInTheWorld joined the dev team as well, after making a bunch of useful pull requests.</b>
            <p>
                Ketey IDE is made by a small bunch of developers.
                A list is below, but you can also check <a href="https://github.com/orgs/Snail-IDE/people">our GitHub</a> incase this one is out of date.
            </p>
            <UserList users={UserData.snDev} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <h2>Contriubuters</h2>
            <p>
                Ketey IDE is made by a small bunch of developers, but people will sometimes contribute!
            </p>
            <UserList users={UserData.snContributeCodeBerg} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>
                ♥ Without PenguinMod, Snail IDE would never exist, here the PenguinMod Dev Team is listed ♥
                A list is below, but you can also check <a href="https://github.com/orgs/penguinmod/people">their GitHub</a> incase this one is out of date. But not all devs are listed there.
            </p>
            <UserList users={UserData.pmDevelopers} />
            <p><i>This list's order is also randomized on each refresh.</i></p>
        </section>
        <section>
            <h2>Vercel</h2>
            <p>We currently use <a href="https://vercel.com/">Vercel</a> to host Ketey IDE.</p>
            <a href="https://vercel.com/">
                <img
                    src="https://raw.githubusercontent.com/github/explore/3c66f1237835e0b877190fbea528d0ebece7bccf/topics/vercel/vercel.png"
                    width="160"
                    height="160"
                />
            </a>
            <h2>Domain Provider</h2>
            <p>
                <a href="https://ketey-ide.com">ketey-ide.com</a> is provided by <a href="https://scratch.mit.edu/users/dumorando/">dumorando</a>
            </p>
            <h2>Sound Effects</h2>
            <p>
                Snail IDE has added some more sounds to the Sound Library.
                Most Snail IDE sounds are
                from <a href="https://freesound.org/">https://freesound.org/</a> and <a href="https://archive.org/">https://archive.org/</a> under
                the Public Domain license. But we have also added some songs created by <a href="https://incompetech.com/">Kevin Macleod.</a>
            </p>
        </section>
        <section>
            <h1>PenguinMod, TurboWarp, Snail IDE and Ketey IDE </h1>
        </section>
        <section>
            <h2>Extensions</h2>
            <p><i>
                If you are an extension developer who wants their extension removed from PenguinMod's extensions list,
                contact us as soon as you can. We'll get it removed as soon as we are able to.
            </i></p>
            <p>
                We use some MIT licensed extensions from TurboWarp as they are really useful!
                Check out the full list of TurboWarp extensions <a href="https://extensions.turbowarp.org/">here</a>,
                but we still need to credit these people!
                Check them out below:
            </p>
            <UserList users={UserData.extensionDevelopers} />
            <p>
                We also have added extension created by the Ruby Dev Team since they are really cool and useful!
                Check out the full list of Ruby extensions <a href="https://rubyteam.tech/gallery">here</a>,
                but we still need to credit these people!
                Check them out below:
            </p>
            <UserList users={UserData.rubyDev} />
            <p>
                Both of those credits are not listed in specific order. They are randomized on refresh.
            </p>
        </section>
        <section>
            <h2>Addons</h2>
            <p>
                Addons are mostly taken from <a href="https://scratchaddons.com/">Scratch Addons</a>,
                but we hope to have some Snail IDE addons in the future.
                Here are the developers that made the current addons available.
            </p>
            <UserList users={UserData.addonDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
        </section>
        <section>
            <h1>TurboWarp</h1>
        </section>
        <section>
            <p>
                The TurboWarp project is made possible by the work of many volunteers.
                <br></br>
                You can check out TurboWarp's individual credits <a href="https://turbowarp.org/credits.html">here</a>.
                <br></br>
                <a href="https://github.com/sponsors/GarboMuffin">
                    Donate to support TurboWarp.
                </a>
            </p>
        </section>
        {/* RIP Fosshost */}
        {/* <section>
            <h2>Fosshost</h2>
            <p>
                The TurboWarp project is proudly hosted by <a href="https://fosshost.org/">Fosshost</a> who provide free computing resources to the open source community.
            </p>
            <p>
                <a href="https://fosshost.org/donate">
                    Donate to support Fosshost.
                </a>
            </p>
            <a href="https://fosshost.org/">
                <img
                    src={fosshostLogo}
                    width="250"
                    height="125"
                />
            </a>
        </section> */}
        <section>
            <h2>Scratch</h2>
            <p>
                TurboWarp is based on the work of the <a href="https://scratch.mit.edu/credits">Scratch contributors</a> but is not endorsed by Scratch in any way.
            </p>
            <p>
                <a href="https://scratch.mit.edu/donate">
                    Donate to support Scratch.
                </a>
            </p>
        </section>
        <section>
            <h2>Translators</h2>
            <p>
                More than 100 people have helped translate TurboWarp and its addons into many languages —
                far more than we could hope to list here.
            </p>
            <p>
                Unfortunately due to Snail IDE's small size, we have decided to mainly focus on English.
                You can still use Snail IDE with the other languages, but they will not be updated at this time.
            </p>
        </section>
        <section>
            <h2>IncompeteTech</h2>
            <p>
                We added some songs from IncompeteTech to Snail IDE, we have to have proper credit though!
            </p>
            <p>"Scheming Weasel (slower version)" Kevin MacLeod (incompetech.com)
                    Licensed under Creative Commons: By Attribution 4.0 License
                    http://creativecommons.org/licenses/by/4.0/
            </p>
            <p>"Monkeys Spinning Monkeys" Kevin MacLeod (incompetech.com)
                    Licensed under Creative Commons: By Attribution 4.0 License
                    http://creativecommons.org/licenses/by/4.0/</p>
            <p>"Sneaky Snitch" Kevin MacLeod (incompetech.com)
                    Licensed under Creative Commons: By Attribution 4.0 License
                    http://creativecommons.org/licenses/by/4.0/</p>
            <p>"Inspired" Kevin MacLeod (incompetech.com)
                    Licensed under Creative Commons: By Attribution 4.0 License
                    http://creativecommons.org/licenses/by/4.0/</p>
        </section>
        <section>
            <p>
                <i>
                    Individual contributors are listed in no particular order.
                    The order is randomized each visit.
                </i>
            </p>
        </section>
    </main>
);

document.body.setAttribute('theme', getInitialDarkMode() ? 'dark' : 'light');

ReactDOM.render((
    <Credits />
), appTarget);
