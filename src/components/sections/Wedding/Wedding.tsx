import Section from "@/components/ui/Section/Section";
import Container from "@/components/ui/Container/Container";

import styles from "./Wedding.module.css";
import Link from "next/link";

function Wedding() {
    return (
        <Section>
            <Container>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Musik som gör ert bröllop personligt, varmt och minnesvärt</h3>
                    <p className={styles.text}>
                        Att planera ett bröllop innebär många val. <br />
                        Ett av de viktigaste är musiken – den som ska bära känslan genom hela dagen.
                        <br /> <br />
                        <strong>Stockholm Music Group</strong> hjälper er att skapa rätt stämning, utan stress eller osäkerhet. <br /> <br />
                        Vi är en professionell och samspelt cover-trio som guidar er från ceremoni till mingel och middag, med varm sång, personlig repertoar och en trygg helhetslösning.
                    </p>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Känner ni igen er?</h3>
                    <ul className={styles.list}>
                        <li>Ni vill att musiken ska kännas ni – inte generisk</li>
                        <li>Ni vill kunna lita på att allt fungerar på dagen</li>
                        <li>Ni vill slippa krångel med ljud, upplägg och detaljer</li>
                    </ul>
                    <p className={styles.text}>Ni ska inte behöva oroa er för musiken på ert bröllop.
                        Det är där vi kommer in.</p>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Så hjälper vi er – steg för steg</h3>
                    <ol className={styles.list}>
                        <li><strong>Vi lyssnar på er</strong><br /> Era önskemål, er stil och er vision för dagen</li>
                        <li><strong>Vi planerar musiken</strong><br /> Låtval, stämning, tider och teknisk lösning – anpassat efter er.</li>
                        <li><strong>Vi levererar tryggt på dagen</strong><br />Ni kan slappna av och vara närvarande. Vi tar hand om resten.</li>
                    </ol>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Musik för hela bröllopsdagen</h3>
                    <p className={styles.text}><strong>🎵 Ceremoni</strong> <br /> Personliga tolkningar av era favoritlåtar – musik som förstärker ögonblicket.</p>
                    <p className={styles.text}><strong>🥂 Mingel & middag</strong> <br /> Stämningsfulla akustiska set som skapar värme och ett naturligt flöde.</p>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Varför välja Stockholm Music Group?</h3>
                    <ul className={styles.list}>
                        <li>Erfaren, samspelt och pålitlig trio</li>
                        <li>Brett repertoarspann: pop, soul, jazz, rock, visor & svenska klassiker</li>
                        <li>Personligt bemötande och skräddarsydda låtval</li>
                        <li>Professionellt ljud och en smidig helhetslösning</li>
                    </ul>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>Resultatet</h3>
                    <p className={styles.text}>Ett bröllop där:</p>
                    <ul className={styles.list}>
                        <li>ni kan vara helt närvarande</li>
                        <li>gästerna känner stämningen</li>
                        <li>musiken blir en naturlig del av minnet</li>
                    </ul>
                    <p className={styles.text}><strong>Stockholm Music Group</strong> – vi guidar er till ett bröllop som känns lika bra som det låter.</p>
                </div>
                <div className={styles.ctaWrapper}>
                    <Link className={styles.cta} href="#contact">👉 Kontakta oss för lediga datum</Link>
                </div>
            </Container>
        </Section>
    );
}

export default Wedding;
