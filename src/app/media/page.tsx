import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import MediaGallery from "@/components/media-gallery";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  const heroItems = mediaItems.slice(0, 3);
  const photos = mediaItems.filter((item) => item.type === "PHOTO").length;
  const videos = mediaItems.filter((item) => item.type === "VIDEO").length;

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="fun-hero blob-field">
        <span className="blob blob-aqua" />
        <span className="blob blob-pink" />
        <div className="content-width fun-hero-grid">
          <div>
            <span className="pill pill-pink">Media gallery</span>
            <h1>
              Photos and videos from <em>our clean-ups.</em>
            </h1>
            <p className="lead">
              Straight from the beach. Moments captured by volunteers and our field team during
              clean-ups and community days across Sierra Leone&apos;s coast.
            </p>
            <div className="hero-tags">
              <span className="pill pill-aqua">{photos} photos</span>
              <span className="pill pill-grape">{videos} videos</span>
              <span className="pill pill-sun">Updated weekly</span>
            </div>
          </div>
          <div className="collage" aria-hidden="true">
            {heroItems[0] ? (
              <div className="collage-tile collage-t1">
                {heroItems[0].type === "VIDEO" ? (
                  <video src={heroItems[0].url} muted playsInline />
                ) : (
                  <img src={heroItems[0].url} alt="" />
                )}
              </div>
            ) : null}
            {heroItems[1] ? (
              <div className="collage-tile collage-t2">
                {heroItems[1].type === "VIDEO" ? (
                  <video src={heroItems[1].url} muted playsInline />
                ) : (
                  <img src={heroItems[1].url} alt="" />
                )}
              </div>
            ) : null}
            {heroItems[2] ? (
              <div className="collage-tile collage-t3">
                {heroItems[2].type === "VIDEO" ? (
                  <video src={heroItems[2].url} muted playsInline />
                ) : (
                  <img src={heroItems[2].url} alt="" />
                )}
              </div>
            ) : null}
            <span className="collage-chip c1">Field team</span>
            <span className="collage-chip c2">On the sand</span>
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width">
          <MediaGallery mediaItems={mediaItems} />
        </div>
      </section>

      <section className="band band-grape">
        <div className="content-width" style={{ textAlign: "center" }}>
          <h2 style={{ margin: "0 auto 16px", maxWidth: 700 }}>
            Want to be in the <em>next photos?</em>
          </h2>
          <p style={{ margin: "0 auto 28px" }}>
            Join a clean-up and help us make the shoreline — and the memories — a little brighter.
          </p>
          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary" href="/volunteer">
              Join as a volunteer
            </Link>
            <Link className="btn btn-ghost" href="/events">
              See upcoming clean-ups
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
