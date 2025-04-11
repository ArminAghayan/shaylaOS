import React from "react";
import { Button, Anchor } from "react95";

import useNewWindow from "../../hooks/useNewWindow";

import "./styles.scss";

export default function About() {
  const open = useNewWindow();

  const handleClick = () => {
    open("github95", "edwardpayton");
  };

  return (
    <section className="aboutWindow">
      <div className="flex justify-between aboutWindow__header">
        <div className="flex flex-auto items-center">
          <Button variant="menu" size="sm">
            File
          </Button>
          <Button variant="menu" size="sm">
            Edit
          </Button>
          <Button variant="menu" size="sm">
            View
          </Button>
        </div>
      </div>
      <div className="scrollable -yOnly aboutWindow__body">
        <div className="aboutWindow__bodyInner">
          <h1 className="mb2">What is ShaylaOS?</h1>
          <p className="mb2">
            Welcome to ShaylaOS my Shayla - where we can browse our memories and dates that me and you have shared together my love. I've been working on this for a while now and I'm so excited to share it with you.
          </p>

  

          <p className="mb2">
            I will be adding more stuff to this as time goes on, so you can go on it whenever you want and see what i've added, so this will be a gift for life.
          </p>
          <p className="mb2">
            So far we have photos, videos, letters, but i gonna add more stuff that i have in mind that I think you will love.
          </p>

          <p className="mb2">
            Laslty, before you go and see the rest of this beautiful OS (lol), I just want to say that I love you so much my shayla. I'm so grateful to have you in my life and I'm looking forward to spending the rest of my life with you. Happy 3 month anniversary my princess.
          </p>
          <img
            src={require("../../assets/shaylaandme.png")}
            alt="Shayla and me"
            style={{ width: "25%", height: "auto" }}
          />

          <p className="mt2">Love you so much my love ❤️</p>
        </div>
      </div>
    </section>
  );
}
