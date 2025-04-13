"use client";

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="footer">
            {/* Logo links */}
            <div className="footer-logo">
                <Image src="/pic/logo-small.png" alt="Logo" width={50} height={50} />
            </div>

            {/* Footer-Links & Infos */}
            <div className="footer-links">
                <a href="/impressum">Impressum</a>
                <a href="/datenschutzerklaerung">Datenschutz</a>
            </div>

            {/* Copyright */}
            <div className="footer-copy">
                © {new Date().getFullYear()} Klassenkasse. Alle Rechte vorbehalten.
            </div>
        </footer>
    );
}
