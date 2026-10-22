
import logo from '@/assets/logo.png';
import Image from 'next/image';
import classes from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={classes.main}>
      <section className={classes.hero}>
        <div className={classes.logoWrapper}>
          <Image
            src={logo}
            alt="DevNotes logo"
            width={200}
            height={200}
            priority
            className={classes.logo}
          />
        </div>

        <p className={classes.tagline}>
          YOUR DEVELOPER SPACE
        </p>

        <h1 className={classes.heading}>
          DevNotes <span>— Learn. Build. Share.</span>
        </h1>

        <h2 className={classes.subheading}>
          Your developer journey, documented in one place.
        </h2>

        <p className={classes.description}>
          DevNotes is a space for developers to document
          what they learn, share technical knowledge, and
          turn ideas into practical notes. Explore programming
          concepts, discover new techniques, and share your
          experiences with the developer community.
        </p>

        <p className={classes.description}>
          Whether you're learning a new technology or
          solving a tricky bug, keep your knowledge organized
          and make every line of code count.
        </p>

        <p className={classes.motto}>
          Learn something new. Build something great.
          Share what you know.
        </p>

        <div className={classes.actions}>
          <Link href="/notes" className={classes.primaryButton}>
            Explore Notes <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
